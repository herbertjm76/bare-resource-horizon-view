-- Fix profiles RLS: Change from RESTRICTIVE (AND logic) to PERMISSIVE (OR logic)
-- This allows users to see all profiles within their company, not just their own

-- Drop the existing RESTRICTIVE SELECT policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Company members can view company profiles" ON public.profiles;

-- Create a single PERMISSIVE SELECT policy for company-wide visibility
CREATE POLICY "Company members can view profiles in their company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  company_id IS NOT NULL 
  AND company_id = public.get_my_company_id()
);

-- Also allow users to see their own profile even if company_id is somehow null
CREATE POLICY "Users can always view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());