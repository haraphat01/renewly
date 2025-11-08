'use client'

import { useState } from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleManage = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if it's a configuration error
        if (data.setupUrl) {
          setError(data.message || 'Customer Portal needs to be configured')
          // Show error but also provide link to configure
          const shouldConfigure = confirm(
            `${data.message}\n\nWould you like to open Stripe Dashboard to configure it now?`
          )
          if (shouldConfigure && data.setupUrl) {
            window.open(data.setupUrl, '_blank')
          }
          setLoading(false)
          return
        }
        throw new Error(data.error || data.message || 'Failed to create portal session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      setError(error.message || 'Failed to open billing portal')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleManage}
        disabled={loading}
        className="text-sm text-gray-600 hover:text-gray-900 underline disabled:opacity-50 text-left"
      >
        {loading ? 'Loading...' : 'Manage Subscription'}
      </button>
      {error && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-800 font-medium">{error}</p>
            <p className="text-yellow-700 mt-1 text-xs">
              To enable subscription management, configure the Stripe Customer Portal in your Stripe Dashboard.
            </p>
            <a
              href="https://dashboard.stripe.com/settings/billing/portal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-yellow-800 hover:text-yellow-900 underline mt-2 text-xs font-medium"
            >
              Configure Portal <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

