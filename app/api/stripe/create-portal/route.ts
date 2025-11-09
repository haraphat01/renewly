import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, getOrCreateUserProfile } from '@/lib/supabase/auth'
import { stripe } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth()
    const supabase = await createClient()

    // Get or create user profile
    const user = await getOrCreateUserProfile(
      authUser.id,
      authUser.email || '',
      authUser.user_metadata?.full_name
    )

    // Get subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    // Create portal session
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripe_customer_id,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      })

      return NextResponse.json({ url: session.url })
    } catch (portalError: any) {
      // Check if it's a configuration error
      if (portalError?.code === 'resource_missing' || portalError?.message?.includes('configuration')) {
        console.error('Stripe Customer Portal not configured:', portalError)
        return NextResponse.json({ 
          error: 'Customer Portal not configured',
          message: 'Please configure the Stripe Customer Portal in your Stripe Dashboard. Go to Settings → Billing → Customer Portal and save your configuration.',
          setupUrl: 'https://dashboard.stripe.com/settings/billing/portal'
        }, { status: 400 })
      }
      throw portalError
    }
  } catch (error: any) {
    console.error('Portal session error:', error)
    return NextResponse.json({ 
      error: error.error || error.message || 'Failed to create portal session',
      message: error.message || 'Please try again or contact support if the issue persists.'
    }, { status: 500 })
  }
}

