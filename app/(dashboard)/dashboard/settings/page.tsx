import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, getOrCreateUserProfile } from '@/lib/supabase/auth'
import { Bell, CreditCard, User } from 'lucide-react'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import SuccessMessage from './SuccessMessage'
import Link from 'next/link'
import UserProfileButton from './UserProfileButton'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
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
    .eq('status', 'active')
    .single()

  const plan = subscription?.plan || 'free'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <SuccessMessage />

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.full_name || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email is managed by your account</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={user.phone_number || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Reminders</h3>
              <p className="text-sm text-gray-600">Receive email notifications for contract renewals</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">SMS Reminders</h3>
              <p className="text-sm text-gray-600">
                Receive SMS notifications (Pro and Premium only)
                {plan === 'free' && <span className="text-purple-600 font-medium"> - Upgrade to enable</span>}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                defaultChecked={user.sms_enabled && plan !== 'free'} 
                disabled={plan === 'free'}
                className="sr-only peer disabled:opacity-50" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Subscription</h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 capitalize">{plan} Plan</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {plan === 'free' && '1 active contract, email reminders only'}
                {plan === 'pro' && 'Unlimited contracts, email + SMS, analytics'}
              </p>
            </div>
            {plan === 'free' && (
              <Link
                href="/dashboard/upgrade"
                className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base whitespace-nowrap inline-block text-center"
              >
                Upgrade to Pro
              </Link>
            )}
            {plan !== 'free' && (
              <ManageSubscriptionButton />
            )}
          </div>
          {subscription?.current_period_end && (
            <p className="text-sm text-gray-600">
              Current period ends: {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Delete Account
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

