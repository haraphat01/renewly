# Supabase Auth Migration Guide

This document outlines the migration from Clerk to Supabase Auth.

## Changes Made

### 1. Authentication System
- **Removed**: Clerk authentication (`@clerk/nextjs`)
- **Added**: Supabase Auth (already included in `@supabase/ssr`)

### 2. Database Schema
- **Removed**: `clerk_id` column from `users` table
- **Updated**: `users.id` now directly references `auth.users.id`
- **Added**: Automatic user profile creation via database trigger

### 3. API Routes
All API routes now use:
- `requireAuth()` - Get authenticated user or redirect
- `getOrCreateUserProfile()` - Get or create user profile in database

### 4. Pages
- **Sign In**: `/sign-in` - Custom Supabase Auth page
- **Sign Up**: `/sign-up` - Custom Supabase Auth page
- **Auth Callback**: `/auth/callback` - Handles OAuth redirects

### 5. Components
- **AuthButtons**: Replaces Clerk's `SignInButton`/`SignUpButton`
- **UserProfileButton**: Replaces Clerk's `UserButton`

## Environment Variables

No new environment variables needed. The existing Supabase variables are used:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

## Database Migration

Run the migration to update your database schema:

```sql
-- This is in supabase/migrations/002_migrate_to_supabase_auth.sql
```

The migration will:
1. Remove `clerk_id` column
2. Create a trigger to auto-create user profiles on signup
3. Sync existing auth.users with the users table

## Setup Steps

1. **Run Database Migration**:
   ```bash
   # If using Supabase CLI
   supabase db push
   
   # Or run the SQL manually in Supabase Dashboard
   ```

2. **Enable Google OAuth (Optional)**:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

3. **Update Environment Variables**:
   - Remove any Clerk-related environment variables
   - Ensure Supabase variables are set

4. **Install Dependencies**:
   ```bash
   npm install
   # Clerk will be removed automatically
   ```

## Features

### Email/Password Authentication
- Users can sign up and sign in with email/password
- Password must be at least 6 characters

### Google OAuth
- Users can sign in with Google
- Requires Google OAuth setup in Supabase Dashboard

### User Profiles
- Automatically created on signup via database trigger
- Linked to `auth.users.id`
- Stores email, full name, phone, and preferences

## Testing

1. Test sign up with email/password
2. Test sign in with email/password
3. Test Google OAuth (if enabled)
4. Test protected routes redirect to sign-in
5. Test user profile creation
6. Test contract creation/management

## Breaking Changes

- Existing users with `clerk_id` will need to re-register
- If you have production data, you'll need to migrate user IDs manually
- All authentication flows now use Supabase Auth

## Rollback

If you need to rollback:
1. Restore the previous database schema
2. Reinstall Clerk: `npm install @clerk/nextjs`
3. Revert code changes from git history

