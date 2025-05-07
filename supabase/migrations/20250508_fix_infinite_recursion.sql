
-- First drop ALL existing policies on the profiles table to start with a clean slate
DROP POLICY IF EXISTS "Company admins/owners can view all company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Company owners can update company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a security definer function to safely check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text FROM public.profiles WHERE id = user_id;
$$;

-- Create a security definer function to check if users are in the same company
CREATE OR REPLACE FUNCTION public.users_are_in_same_company(user_id_1 uuid, user_id_2 uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  company_id_1 uuid;
  company_id_2 uuid;
BEGIN
  SELECT company_id INTO company_id_1 FROM public.profiles WHERE id = user_id_1;
  SELECT company_id INTO company_id_2 FROM public.profiles WHERE id = user_id_2;
  
  -- Return true if both users are in the same company and the company is not null
  RETURN company_id_1 IS NOT NULL AND company_id_1 = company_id_2;
END;
$$;

-- Create simple enabling policies for basic operations

-- Enable row creation (critical for sign-up)
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policies for admin/owner operations using security definer functions
CREATE POLICY "Company admins/owners can view all company profiles"
ON public.profiles
FOR SELECT
USING (
  public.get_user_role(auth.uid()) IN ('admin', 'owner') 
  AND public.users_are_in_same_company(auth.uid(), id)
);

-- Similarly fix the update policy using security definer functions
CREATE POLICY "Company owners can update company profiles"
ON public.profiles
FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'owner' 
  AND public.users_are_in_same_company(auth.uid(), id)
);
