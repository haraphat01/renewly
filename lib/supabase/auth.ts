import { createClient } from './server'
import { redirect } from 'next/navigation'

/**
 * Get the current authenticated user from Supabase
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get the current authenticated user or redirect to sign-in
 * Use this in protected routes
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return user
}

/**
 * Get or create user profile in the users table
 * Links Supabase auth user to our users table
 */
export async function getOrCreateUserProfile(authUserId: string, email: string, fullName?: string) {
  const supabase = await createClient()
  
  // Check if user profile exists
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUserId)
    .single()

  if (!user) {
    // Create user profile
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authUserId, // Use Supabase auth user ID directly
        email,
        full_name: fullName || null,
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user profile:', userError)
      throw new Error('Failed to create user profile')
    }
    user = newUser
  } else {
    // Update email if it changed
    if (user.email !== email) {
      await supabase
        .from('users')
        .update({ email })
        .eq('id', authUserId)
    }
  }

  return user
}

