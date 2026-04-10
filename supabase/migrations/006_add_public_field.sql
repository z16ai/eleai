-- Add public field to image_generations, default true
ALTER TABLE IF EXISTS public.image_generations
ADD COLUMN IF NOT EXISTS public boolean DEFAULT true;

-- Update existing rows to be public
UPDATE public.image_generations SET public = true WHERE public IS NULL;
