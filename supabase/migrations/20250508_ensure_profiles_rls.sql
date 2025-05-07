
-- Make sure RLS is enabled on profiles table
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure public access is restricted
ALTER TABLE IF EXISTS public.profiles FORCE ROW LEVEL SECURITY;
