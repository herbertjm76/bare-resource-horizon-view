-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Company owners can insert companies" ON public.companies;

-- Create new policy that allows users to create their first company
CREATE POLICY "Users can create their first company" 
ON public.companies 
FOR INSERT 
TO authenticated 
WITH CHECK (
  -- Allow if user doesn't have a company yet (first company creation during signup)
  NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
  -- OR if they're already an admin/owner trying to create another company
  OR user_is_admin_safe()
);