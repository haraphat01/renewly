import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, getOrCreateUserProfile } from '@/lib/supabase/auth'
import { stripe, STRIPE_PLANS } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth()
    const body = await request.json()
    const { plan, interval = 'month' } = body

    if (!plan || !STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (interval !== 'month' && interval !== 'year') {
      return NextResponse.json({ error: 'Invalid billing interval' }, { status: 400 })
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]
    const priceId = interval === 'year' ? planConfig.yearly.priceId : planConfig.monthly.priceId

    const supabase = await createClient()

    // Get or create user profile
    const user = await getOrCreateUserProfile(
      authUser.id,
      authUser.email || '',
      authUser.user_metadata?.full_name
    )

    // Get existing subscription to check for customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let customerId = existingSubscription?.stripe_customer_id

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authUser.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      metadata: {
        user_id: user.id,
        plan,
        interval,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 })
  }
}

