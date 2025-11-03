-- Drop the existing policy that only allows authenticated users
DROP POLICY IF EXISTS "Users can create their first company" ON public.companies;

-- Create new policy that allows both anon (during signup) and authenticated users to create companies
CREATE POLICY "Allow company creation during signup" 
ON public.companies 
FOR INSERT 
WITH CHECK (
  -- Allow anon users to create companies (for signup flow)
  auth.role() = 'anon'
  -- OR allow authenticated users who don't have a company yet
  OR (
    auth.role() = 'authenticated' 
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND company_id IS NOT NULL
    )
  )
  -- OR allow existing admins/owners
  OR user_is_admin_safe()
);