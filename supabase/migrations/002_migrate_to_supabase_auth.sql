-- Migration to switch from Clerk to Supabase Auth
-- This migration updates the users table to use Supabase auth.users

-- First, drop the unique constraint on clerk_id if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_clerk_id_key;

-- Remove the clerk_id column
ALTER TABLE users DROP COLUMN IF EXISTS clerk_id;

-- Update the users table to use id from auth.users
-- The id column should already be UUID, but we'll ensure it references auth.users
-- Note: In Supabase, the users table id should match auth.users.id
-- We'll use a trigger to automatically create a user profile when a user signs up

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing users if any (for migration purposes)
-- This will sync any existing auth.users with the users table
INSERT INTO public.users (id, email, full_name)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', NULL) as full_name
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, users.full_name),
  updated_at = NOW();

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

