-- SECURITY FIX: Remove dangerous role column from profiles table
-- This prevents privilege escalation attacks where users can modify their own roles
-- Roles are properly managed in the user_roles table with admin-only policies
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- SECURITY FIX: Add database constraints for financial transactions
-- Prevent negative amounts and invalid transaction types
ALTER TABLE public.financial_transactions 
  DROP CONSTRAINT IF EXISTS positive_amount,
  DROP CONSTRAINT IF EXISTS valid_type,
  DROP CONSTRAINT IF EXISTS valid_status,
  DROP CONSTRAINT IF EXISTS amount_max_value;

ALTER TABLE public.financial_transactions 
  ADD CONSTRAINT positive_amount CHECK (amount > 0),
  ADD CONSTRAINT valid_type CHECK (type IN ('income', 'expense')),
  ADD CONSTRAINT valid_status CHECK (status IN ('completed', 'pending', 'cancelled')),
  ADD CONSTRAINT amount_max_value CHECK (amount <= 999999999);

-- SECURITY FIX: Add soft delete column to profiles for data retention
-- This is safer than allowing hard deletes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- SECURITY FIX: Add explicit DELETE policy for profiles (prevent unauthorized deletion)
-- Use soft delete approach - profiles cannot be hard deleted
DROP POLICY IF EXISTS "Profiles cannot be deleted" ON public.profiles;
CREATE POLICY "Profiles cannot be deleted"
ON public.profiles
FOR DELETE
USING (false);

-- Update SELECT policy to exclude soft-deleted profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own active profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);