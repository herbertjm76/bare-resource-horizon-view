-- Drop existing problematic policies on user_roles
DROP POLICY IF EXISTS "Admins can manage user roles in their company" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view roles in their company" ON public.user_roles;

-- Create new policies that don't cause recursion
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Users can view roles of people in their company (using profiles, not user_roles)
CREATE POLICY "Users can view roles in their company"
ON public.user_roles
FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Create a security definer function for checking admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin_for_company(check_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND company_id = check_company_id
      AND role IN ('admin', 'owner')
  )
$$;

-- Admins can insert roles in their company
CREATE POLICY "Admins can insert roles in their company"
ON public.user_roles
FOR INSERT
WITH CHECK (
  public.is_admin_for_company(company_id)
);

-- Admins can update roles in their company
CREATE POLICY "Admins can update roles in their company"
ON public.user_roles
FOR UPDATE
USING (
  public.is_admin_for_company(company_id)
);

-- Admins can delete roles in their company
CREATE POLICY "Admins can delete roles in their company"
ON public.user_roles
FOR DELETE
USING (
  public.is_admin_for_company(company_id)
);