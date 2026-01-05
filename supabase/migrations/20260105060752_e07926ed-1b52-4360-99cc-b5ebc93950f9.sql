-- Add policy for regular company members to view profiles in their company
-- This ensures all authenticated users can view profiles within their own company only

CREATE POLICY "Company members can view profiles in their company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  company_id IS NOT NULL 
  AND company_id = get_user_company_id_safe()
);