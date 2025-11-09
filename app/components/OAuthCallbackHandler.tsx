'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OAuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // If there's a code parameter, exchange it for a session
      const handleOAuthCallback = async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code for session:', error)
            // Redirect to sign-in with error
            router.push('/sign-in?error=authentication_failed')
            return
          }

          // Wait a moment for session to be established
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // Redirect to dashboard
          window.location.href = '/dashboard'
        } catch (error) {
          console.error('Error in OAuth callback:', error)
          router.push('/sign-in?error=authentication_failed')
        }
      }

      handleOAuthCallback()
    }
  }, [searchParams, router])

  return null
}

