-- Function to reset daily points
CREATE OR REPLACE FUNCTION public.reset_daily_points()
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_points
  SET points = 88, last_reset_date = CURRENT_DATE, updated_at = NOW()
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.reset_daily_points() TO anon, authenticated;