-- Drop existing overly permissive SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view basic profile info of company members" ON public.profiles;
DROP POLICY IF EXISTS "Users can view limited profile info in their company" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a single consolidated and secure SELECT policy that explicitly requires authentication
CREATE POLICY "Authenticated users can view profiles in their company" 
ON public.profiles
FOR SELECT
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND (
    -- Can view own profile
    id = auth.uid()
    -- Or can view profiles in the same company
    OR (
      company_id IS NOT NULL 
      AND company_id = get_user_company_id_safe()
    )
  )
);