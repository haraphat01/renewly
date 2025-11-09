import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to sign-in with error
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('error', 'authentication_failed')
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('error', 'authentication_failed')
      return NextResponse.redirect(signInUrl)
    }
  }

  // Redirect to dashboard after successful authentication
  const dashboardUrl = new URL('/dashboard', request.url)
  return NextResponse.redirect(dashboardUrl)
}

