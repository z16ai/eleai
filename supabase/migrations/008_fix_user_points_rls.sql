-- Fix RLS policy for user_points - add insert policy
CREATE POLICY "Users can insert own points" ON public.user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);
