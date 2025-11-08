import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/config'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

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

        // Access current_period_end with proper typing (now at item level)
        const currentPeriodEnd = subscription.items?.data[0]?.current_period_end 
          ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          : null

        const subscriptionData = {
          plan: metadata.plan,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string,
          status: subscription.status, // Use the full status to handle 'trialing', 'active', etc.
          current_period_end: currentPeriodEnd,
        }

        // Update or create subscription in database
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', metadata.user_id)
          .single()

        if (existing) {
          await supabase
            .from('subscriptions')
            .update(subscriptionData)
            .eq('user_id', metadata.user_id)
        } else {
          await supabase
            .from('subscriptions')
            .insert({
              user_id: metadata.user_id,
              ...subscriptionData,
            })
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

          const periodEnd = subscriptionObj.items?.data[0]?.current_period_end 
            ? new Date(subscriptionObj.items.data[0].current_period_end * 1000).toISOString()
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
        const subscriptionId = invoice.lines?.data[0]?.parent as string | null

        if (subscriptionId) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (sub) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
              })
              .eq('id', sub.id)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.lines?.data[0]?.parent as string | null

        if (subscriptionId) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (sub) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'past_due',
              })
              .eq('id', sub.id)
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