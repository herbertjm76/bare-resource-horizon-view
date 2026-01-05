-- Drop the existing permissive policy for viewing profiles
DROP POLICY IF EXISTS "Users can view profiles in their own company" ON public.profiles;

-- Create role-based SELECT policies for the profiles table

-- Policy 1: Users can always view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Owners and Admins can view all profiles in their company
CREATE POLICY "Admins can view all profiles in their company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (company_id IS NOT NULL) 
  AND (company_id = get_user_company_id_safe())
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = profiles.company_id
      AND user_roles.role IN ('owner', 'admin')
    )
  )
);

-- Policy 3: Project managers can view profiles of their direct reports and project team members
CREATE POLICY "Project managers can view team profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (company_id IS NOT NULL)
  AND (company_id = get_user_company_id_safe())
  AND (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = profiles.company_id
      AND user_roles.role = 'project_manager'
    )
  )
  AND (
    -- Can view their direct reports
    profiles.manager_id = auth.uid()
    OR
    -- Can view team members on shared projects
    EXISTS (
      SELECT 1 FROM project_resource_allocations pra1
      JOIN project_resource_allocations pra2 ON pra1.project_id = pra2.project_id
      WHERE pra1.resource_id = auth.uid()
      AND pra2.resource_id = profiles.id
    )
    OR
    -- Can view team members assigned to projects they manage
    EXISTS (
      SELECT 1 FROM projects p
      JOIN project_resource_allocations pra ON p.id = pra.project_id
      WHERE p.project_manager_id = auth.uid()
      AND pra.resource_id = profiles.id
    )
  )
);