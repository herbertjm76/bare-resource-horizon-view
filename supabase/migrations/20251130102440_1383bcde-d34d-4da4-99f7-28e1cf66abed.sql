-- Drop the existing policy that might be too restrictive
DROP POLICY IF EXISTS "Company owners can update their company" ON public.companies;

-- Create a clearer policy for company updates
CREATE POLICY "Company members can update their own company"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT company_id 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  id IN (
    SELECT company_id 
    FROM public.profiles 
    WHERE id = auth.uid()
  )
);

-- Ensure admins/owners have full access
CREATE POLICY "Company admins can update their company"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  id = get_user_company_id_safe() AND user_is_admin_safe()
)
WITH CHECK (
  id = get_user_company_id_safe() AND user_is_admin_safe()
);