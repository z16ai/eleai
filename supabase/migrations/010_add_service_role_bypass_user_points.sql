-- Bypass RLS for user_points with service role
-- This allows service role to bypass RLS checks when creating/updating user points

CREATE POLICY "service_role can all user_points" ON public.user_points
  FOR ALL USING (true) WITH CHECK (true);
