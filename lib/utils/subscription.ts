import { createClient } from '@/lib/supabase/server'

export type SubscriptionPlan = 'free' | 'pro'

export const PLAN_LIMITS = {
  free: {
    maxContracts: 1,
    emailReminders: true,
    smsReminders: false,
    analytics: false,
    teamDashboard: false,
    apiAccess: false,
  },
  pro: {
    maxContracts: Infinity,
    emailReminders: true,
    smsReminders: true,
    analytics: true,
    teamDashboard: false,
    apiAccess: false,
  },
}

export async function getUserSubscription(userId: string): Promise<SubscriptionPlan> {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  return subscription?.plan || 'free'
}

export async function canCreateContract(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const plan = await getUserSubscription(userId)
  const limits = PLAN_LIMITS[plan]

  if (limits.maxContracts === Infinity) {
    return { allowed: true }
  }

  const supabase = await createClient()
  
  // For free plan, count ALL contracts (not just active ones)
  // Free users are limited to 1 contract total
  const { count, error } = await supabase
    .from('contracts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Error counting contracts:', error)
    return { allowed: false, reason: 'Error checking contract limit' }
  }

  if ((count || 0) >= limits.maxContracts) {
    return {
      allowed: false,
      reason: `Free plan allows only ${limits.maxContracts} contract. Upgrade to Pro for unlimited contracts.`,
    }
  }

  return { allowed: true }
}

