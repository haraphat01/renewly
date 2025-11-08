'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Check, X, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function ReviewContractPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contract, setContract] = useState<any>(null)
  const [extracted, setExtracted] = useState<any>(null)

  useEffect(() => {
    // In a real app, you'd fetch the contract data
    // For now, we'll redirect to the contract detail page
    if (params.id) {
      router.push(`/dashboard/contracts/${params.id}`)
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return null
}

