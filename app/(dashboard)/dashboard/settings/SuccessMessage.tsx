'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function SuccessMessage() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)
  const [type, setType] = useState<'success' | 'canceled' | null>(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success) {
      setType('success')
      setShow(true)
      // Clear URL params after showing message
      window.history.replaceState({}, '', '/dashboard/settings')
      setTimeout(() => setShow(false), 5000)
    } else if (canceled) {
      setType('canceled')
      setShow(true)
      window.history.replaceState({}, '', '/dashboard/settings')
      setTimeout(() => setShow(false), 5000)
    }
  }, [searchParams])

  if (!show || !type) return null

  return (
    <div
      className={`mb-6 border px-4 py-3 rounded-lg ${
        type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {type === 'success' ? (
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-medium">
            {type === 'success'
              ? 'Subscription activated successfully! 🎉'
              : 'Checkout canceled'}
          </p>
          <p className="text-sm mt-1">
            {type === 'success'
              ? 'Your plan has been upgraded. You now have access to all Pro features.'
              : 'Your subscription was not changed. You can try again anytime.'}
          </p>
        </div>
      </div>
    </div>
  )
}

