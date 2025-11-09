'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'

export default function UserProfileButton() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.email?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.user_metadata?.full_name || user?.email || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
}

