import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getOrCreateUserProfile } from '@/lib/supabase/auth'

export async function GET() {
  try {
    const authUser = await getCurrentUser()

    if (!authUser) {
      return NextResponse.json({ plan: 'free' })
    }

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
      .eq('status', 'active')
      .single()

    return NextResponse.json({ plan: subscription?.plan || 'free' })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ plan: 'free' })
  }
}

