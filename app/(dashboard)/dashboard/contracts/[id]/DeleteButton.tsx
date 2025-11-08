'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteButtonProps {
  contractId: string
  contractName: string
}

export default function DeleteButton({ contractId, contractName }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete contract')
      }

      // Redirect to dashboard after successful deletion
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Failed to delete contract')
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Delete "{contractName}"?</span>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete'
          )}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete contract"
    >
      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  )
}

