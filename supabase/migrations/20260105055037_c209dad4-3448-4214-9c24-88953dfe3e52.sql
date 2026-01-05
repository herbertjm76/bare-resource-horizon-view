-- Drop existing admin policies that are too permissive
DROP POLICY IF EXISTS "Company admins can update personal information for company memb" ON public.personal_information;
DROP POLICY IF EXISTS "Company admins can view personal information for company member" ON public.personal_information;

-- Create new policies that restrict access to only owners (super admins) and profile owners

-- Owners can view personal information for their company members
CREATE POLICY "Owners can view personal information for company members"
ON public.personal_information
FOR SELECT
TO authenticated
USING (
  (company_id = get_user_company_id_safe()) 
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = personal_information.company_id
      AND user_roles.role = 'owner'
    )
  )
);

-- Owners can update personal information for their company members  
CREATE POLICY "Owners can update personal information for company members"
ON public.personal_information
FOR UPDATE
TO authenticated
USING (
  (company_id = get_user_company_id_safe()) 
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = personal_information.company_id
      AND user_roles.role = 'owner'
    )
  )
);