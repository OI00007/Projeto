-- SECURITY FIX: Remove email and phone columns from profiles table
-- Email is already stored securely in auth.users and doesn't need duplication
-- Phone can be added back later with proper column-level security if needed

-- Remove email column (already exists in auth.users)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Remove phone column (can be re-added with proper security if business requires it)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- Update the trigger to not attempt to set email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;