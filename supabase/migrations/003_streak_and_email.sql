-- Migration: Add streak tracking and email digest fields to profiles
-- Date: 2025-12-31

-- Add new columns to profiles table for streak tracking and email preferences
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS check_in_dates JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS last_check_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_digest_enabled BOOLEAN DEFAULT false;

-- Create index for email digest queries (find users who want weekly emails)
CREATE INDEX IF NOT EXISTS idx_profiles_email_digest
ON profiles(email_digest_enabled)
WHERE email_digest_enabled = true;

-- Comment on columns
COMMENT ON COLUMN profiles.check_in_dates IS 'Array of ISO date strings for weekly check-ins to track streak';
COMMENT ON COLUMN profiles.last_check_in IS 'Timestamp of last check-in for streak calculation';
COMMENT ON COLUMN profiles.email_digest_enabled IS 'Whether user wants weekly email digest';
