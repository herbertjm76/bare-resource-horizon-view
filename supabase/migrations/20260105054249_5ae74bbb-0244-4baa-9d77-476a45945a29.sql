-- Drop the existing RESTRICTIVE SELECT policy (restrictive policies have different behavior)
DROP POLICY IF EXISTS "Authenticated users can view profiles in their company" ON public.profiles;

-- Create a proper PERMISSIVE SELECT policy with robust company isolation
-- This ensures users can ONLY see profiles from their own company
CREATE POLICY "Users can view profiles in their own company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Can always view own profile
  id = auth.uid()
  OR (
    -- Can view profiles in same company ONLY if:
    -- 1. The profile has a company_id set
    -- 2. The current user has a company_id set
    -- 3. Both company_ids match
    company_id IS NOT NULL 
    AND get_user_company_id_safe() IS NOT NULL
    AND company_id = get_user_company_id_safe()
  )
);