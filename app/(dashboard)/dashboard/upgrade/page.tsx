'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'

const plan = {
  id: 'pro',
  name: 'Pro',
  monthly: {
    price: 9,
    amount: 9,
  },
  yearly: {
    price: 90,
    amount: 90,
    monthlyEquivalent: 7.5,
    savings: 18,
    savingsPercent: 17,
  },
        description: 'Perfect for independent professionals',
  features: [
    'Unlimited contracts',
    'Email + SMS reminders',
    'Revenue analytics',
    'Priority support',
  ],
}

function UpgradePageContent() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free')
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year')

  useEffect(() => {
    fetch('/api/user/subscription')
      .then(res => res.json())
      .then(data => {
        if (data.plan) {
          setCurrentPlan(data.plan)
        }
      })
      .catch(() => {})
  }, [])

  const handleUpgrade = async (planId: string, interval: 'month' | 'year') => {
    setLoading(`${planId}-${interval}`)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      alert(error.message || 'Failed to start checkout')
      setLoading(null)
    }
  }

  const currentPrice = billingInterval === 'year' ? plan.yearly : plan.monthly

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Upgrade to Pro</h1>
        <p className="text-lg text-gray-600">Unlock unlimited contracts and premium features</p>
      </div>

      {/* Billing Interval Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
              billingInterval === 'year'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            {billingInterval === 'year' && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save {plan.yearly.savingsPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border-2 border-purple-600 p-6 sm:p-8">
          {billingInterval === 'year' && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Best Value - Save ${plan.yearly.savings}/year
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingInterval === 'year' ? plan.yearly.monthlyEquivalent : currentPrice.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              {billingInterval === 'year' && (
                <p className="text-sm text-gray-500">
                  Billed ${plan.yearly.price} annually
                </p>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {currentPlan === 'pro' ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={() => handleUpgrade(plan.id, billingInterval)}
              disabled={loading === `${plan.id}-${billingInterval}`}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === `${plan.id}-${billingInterval}` ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Upgrade to ${plan.name} - $${currentPrice.price}/${billingInterval === 'year' ? 'year' : 'month'}`
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard/settings"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Settings
        </Link>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <UpgradePageContent />
    </Suspense>
  )
}

