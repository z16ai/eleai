-- Migration to add UPDATE policy for image_generations (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own images' AND tablename = 'image_generations'
  ) THEN
    CREATE POLICY "Users can update own images" ON public.image_generations
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own images' AND tablename = 'image_generations'
  ) THEN
    CREATE POLICY "Users can delete own images" ON public.image_generations
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;