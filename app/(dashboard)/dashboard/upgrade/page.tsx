'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'

const plan = {
  id: 'pro',
  name: 'Pro',
  price: 9,
  description: 'Perfect for individual freelancers',
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

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Upgrade to Pro</h1>
        <p className="text-lg text-gray-600">Unlock unlimited contracts and premium features</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border-2 border-purple-600 p-6 sm:p-8">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Recommended
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">/month</span>
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
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading === plan.id}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === plan.id ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Upgrade to ${plan.name}`
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

