-- Step 1: Migrate remaining role data from profiles to user_roles
DO $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, company_id)
  SELECT p.id, p.role::text::public.app_role, p.company_id
  FROM public.profiles p
  WHERE p.role IS NOT NULL 
    AND p.company_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = p.id AND ur.company_id = p.company_id
    )
  ON CONFLICT DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Role migration completed';
END $$;

-- Step 2: Update security functions to use user_roles table
CREATE OR REPLACE FUNCTION public.user_is_admin_safe()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role IN ('admin', 'owner')
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE 
      WHEN role = 'owner' THEN 1
      WHEN role = 'admin' THEN 2
      WHEN role = 'member' THEN 3
    END
  LIMIT 1
$$;

-- Step 3: Update invites table policies to use secure functions
DROP POLICY IF EXISTS "Company admins can update invites" ON public.invites;
DROP POLICY IF EXISTS "Company admins can view invites" ON public.invites;
DROP POLICY IF EXISTS "Company owners and admins can delete invites in their company" ON public.invites;
DROP POLICY IF EXISTS "Owners can create company invites" ON public.invites;
DROP POLICY IF EXISTS "Owners can read company invites" ON public.invites;
DROP POLICY IF EXISTS "Owners can update company invites" ON public.invites;

CREATE POLICY "Admins can view invites in their company"
ON public.invites
FOR SELECT
USING (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
);

CREATE POLICY "Admins can update invites in their company"
ON public.invites
FOR UPDATE
USING (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
);

CREATE POLICY "Admins can delete invites in their company"
ON public.invites
FOR DELETE
USING (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
);

CREATE POLICY "Admins can create invites in their company"
ON public.invites
FOR INSERT
WITH CHECK (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
);

-- Step 4: Update office_holidays policies to use secure functions
DROP POLICY IF EXISTS "Users with admin/owner role can delete holidays" ON public.office_holidays;
DROP POLICY IF EXISTS "Users with admin/owner role can insert holidays" ON public.office_holidays;
DROP POLICY IF EXISTS "Users with admin/owner role can update holidays" ON public.office_holidays;

CREATE POLICY "Admins can manage holidays in their company"
ON public.office_holidays
FOR ALL
USING (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
)
WITH CHECK (
  company_id = get_user_company_id_safe() AND user_is_admin_safe()
);

-- Step 5: Drop the role column from profiles table (CASCADE will drop dependent objects)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role CASCADE;