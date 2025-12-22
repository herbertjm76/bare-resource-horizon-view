-- Fix infinite recursion on user_roles policies by using an RLS-bypassing security definer function

-- 1) Replace helper function with explicit row_security bypass
CREATE OR REPLACE FUNCTION public.is_admin_for_company(check_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND company_id = check_company_id
      AND role IN ('admin', 'owner')
  )
$$;

-- 2) Recreate the admin policies to ensure they are using the updated function
DROP POLICY IF EXISTS "Admins can insert roles in their company" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles in their company" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles in their company" ON public.user_roles;

CREATE POLICY "Admins can insert roles in their company"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin_for_company(company_id));

CREATE POLICY "Admins can update roles in their company"
ON public.user_roles
FOR UPDATE
USING (public.is_admin_for_company(company_id))
WITH CHECK (public.is_admin_for_company(company_id));

CREATE POLICY "Admins can delete roles in their company"
ON public.user_roles
FOR DELETE
USING (public.is_admin_for_company(company_id));
