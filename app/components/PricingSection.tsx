'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function PricingSection() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year')

  const proPlan = {
    monthly: {
      price: 9,
      display: '$9',
      period: '/mo',
    },
    yearly: {
      price: 90,
      display: '$7.50',
      period: '/mo',
      billed: 'Billed $90 annually',
      savings: 'Save 17%',
    },
  }

  const currentPrice = billingInterval === 'year' ? proPlan.yearly : proPlan.monthly

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple, Transparent Pricing</h2>
      
      {/* Billing Interval Toggle */}
      <div className="flex justify-center mb-12">
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
                Save 17%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
          <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-600">/mo</span></div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-600">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              1 active contract
            </li>
            <li className="flex items-center text-gray-600">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              Email reminders
            </li>
            <li className="flex items-center text-gray-400">
              <Check className="h-5 w-5 text-gray-300 mr-2" />
              SMS reminders
            </li>
            <li className="flex items-center text-gray-400">
              <Check className="h-5 w-5 text-gray-300 mr-2" />
              Analytics
            </li>
          </ul>
          <Link
            href="/sign-up"
            className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors inline-block text-center"
          >
            Get Started
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-white transform scale-105 relative">
          <div className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
            POPULAR
          </div>
          {billingInterval === 'year' && (
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              BEST VALUE
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">Pro</h3>
          <div className="mb-2">
            <div className="text-4xl font-bold">
              {currentPrice.display}
              <span className="text-lg opacity-90">{currentPrice.period}</span>
            </div>
            {billingInterval === 'year' && proPlan.yearly.billed && (
              <p className="text-sm opacity-90 mt-1">{proPlan.yearly.billed}</p>
            )}
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Unlimited contracts
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Email + SMS reminders
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Revenue analytics
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Priority support
            </li>
          </ul>
          <Link
            href="/dashboard/upgrade"
            className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-center"
          >
            Start Pro Trial
          </Link>
        </div>
      </div>
    </div>
  )
}

