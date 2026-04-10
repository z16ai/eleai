-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create image_generations table
CREATE TABLE IF NOT EXISTS public.image_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  quality TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_points table
CREATE TABLE IF NOT EXISTS public.user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 88,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- User can read their own data, create their own records
CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own images" ON public.image_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images" ON public.image_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Plaza: Allow public read access to all images
CREATE POLICY "Public can view all images" ON public.image_generations
  FOR SELECT USING (true);

CREATE POLICY "Users can read own points" ON public.user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON public.user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to add user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  INSERT INTO public.user_points (user_id, points, last_reset_date)
  VALUES (NEW.id, 88, CURRENT_DATE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to reset daily points
CREATE OR REPLACE FUNCTION public.reset_daily_points()
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_points
  SET points = 88, last_reset_date = CURRENT_DATE, updated_at = NOW()
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;