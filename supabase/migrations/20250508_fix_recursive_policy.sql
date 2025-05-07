
-- First drop any problematic policies on the profiles table that might be causing recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create a security definer function to check user roles without causing recursion
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role::TEXT INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$;

-- Create a security definer function to check if users are in the same company
CREATE OR REPLACE FUNCTION public.user_in_same_company_as_auth_user(profile_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  auth_company_id uuid;
  profile_company_id uuid;
BEGIN
  -- Get company ID for the authenticated user
  SELECT company_id INTO auth_company_id 
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Get company ID for the profile being checked
  SELECT company_id INTO profile_company_id 
  FROM profiles 
  WHERE id = profile_id;
  
  -- Return true if both users are in the same company
  RETURN auth_company_id = profile_company_id AND auth_company_id IS NOT NULL;
END;
$$;

-- Add proper RLS policies to profiles using the security definer functions
-- Policy for users to select their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy for users to view profiles from their company
CREATE POLICY "Users can view profiles in same company"
ON public.profiles
FOR SELECT
USING (public.user_in_same_company_as_auth_user(id));

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Policy for admins to update any profile in their company
CREATE POLICY "Admins can update company profiles"
ON public.profiles
FOR UPDATE
USING (
  (public.get_auth_user_role() = 'admin' OR public.get_auth_user_role() = 'owner') 
  AND 
  public.user_in_same_company_as_auth_user(id)
);

-- Ensure row level security is enabled on profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
