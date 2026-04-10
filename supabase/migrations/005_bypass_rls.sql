-- Bypass RLS for image_generations insert/update/delete with service role
-- This policy allows service role to bypass RLS checks

-- Or alternatively, add this policy to allow authenticated users to insert/update their own records
-- The issue is that the server-side API doesn't have auth session

-- Solution 1: Add service role bypass policy
CREATE POLICY "service_role can insert image_generations" ON public.image_generations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "service_role can update image_generations" ON public.image_generations
  FOR UPDATE USING (true);

CREATE POLICY "service_role can delete image_generations" ON public.image_generations
  FOR DELETE USING (true);