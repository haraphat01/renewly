'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { User } from 'lucide-react'

export default function AuthButtons() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 px-4 py-2">
          Dashboard
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user.email?.split('@')[0] || 'Account'}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/sign-in" className="text-gray-700 hover:text-gray-900 px-4 py-2">
        Sign In
      </Link>
      <Link href="/sign-up" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
        Get Started
      </Link>
    </div>
  )
}

