-- Add web3_account field to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS web3_account JSONB;

-- Update RLS policy for update
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
