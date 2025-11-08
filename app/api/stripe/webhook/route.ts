import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/config'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (!metadata?.user_id || !metadata?.plan) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get subscription from Stripe
        const subscriptionId = session.subscription as string
        if (!subscriptionId || typeof subscriptionId !== 'string') {
          console.error('No subscription ID in checkout session')
          break
        }
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription

        // Map Stripe status to our database status
        let dbStatus: 'active' | 'canceled' | 'past_due' = 'active'
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          dbStatus = 'canceled'
        } else if (subscription.status === 'past_due') {
          dbStatus = 'past_due'
        } else if (subscription.status === 'active' || subscription.status === 'trialing') {
          dbStatus = 'active'
        }

        const subscriptionData = {
          plan: metadata.plan,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string,
          status: dbStatus,
          current_period_end: (subscription as any).current_period_end 
            ? new Date((subscription as any).current_period_end * 1000).toISOString()
            : null,
        }

        // Update or create subscription in database
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', metadata.user_id)
          .single()

        if (existing) {
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update(subscriptionData)
            .eq('user_id', metadata.user_id)
          
          if (updateError) {
            console.error('Error updating subscription:', updateError)
          } else {
            console.log('Subscription updated successfully for user:', metadata.user_id)
          }
        } else {
          const { error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: metadata.user_id,
              ...subscriptionData,
            })
          
          if (insertError) {
            console.error('Error inserting subscription:', insertError)
          } else {
            console.log('Subscription created successfully for user:', metadata.user_id)
          }
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscriptionObj = event.data.object as Stripe.Subscription
        const customerId = subscriptionObj.customer as string

        // Find user by customer ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          const status = subscriptionObj.status === 'active' ? 'active' : 
                        subscriptionObj.status === 'past_due' ? 'past_due' : 
                        subscriptionObj.status === 'trialing' ? 'trialing' : 'canceled'

          const periodEnd = (subscriptionObj as any).current_period_end 
            ? new Date((subscriptionObj as any).current_period_end * 1000).toISOString()
            : null

          await supabase
            .from('subscriptions')
            .update({
              status,
              current_period_end: periodEnd,
            })
            .eq('id', sub.id)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | null

        if (subscriptionId) {
          const { data: sub, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (subError) {
            console.error('Error finding subscription for invoice:', subError)
            // Try to get subscription from Stripe and create it
            try {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
              const customerId = subscription.customer as string
              
              // Find user by customer ID
              const { data: existingSub } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('stripe_customer_id', customerId)
                .single()
              
              if (existingSub) {
                await supabase
                  .from('subscriptions')
                  .update({
                    status: 'active',
                    current_period_end: (subscription as any).current_period_end 
                      ? new Date((subscription as any).current_period_end * 1000).toISOString()
                      : null,
                  })
                  .eq('id', existingSub.id)
              }
            } catch (err) {
              console.error('Error retrieving subscription from Stripe:', err)
            }
          } else if (sub) {
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'active',
              })
              .eq('id', sub.id)
            
            if (updateError) {
              console.error('Error updating subscription status:', updateError)
            }
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | null

        if (subscriptionId) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (sub) {
            const { error: updateError } = await supabase
              .from('subscriptions')
              .update({
                status: 'past_due',
              })
              .eq('id', sub.id)
            
            if (updateError) {
              console.error('Error updating subscription to past_due:', updateError)
            }
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}