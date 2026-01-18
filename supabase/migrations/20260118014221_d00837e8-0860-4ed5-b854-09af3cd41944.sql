-- Remove 'contractor' from the app_role enum
-- Step 1: Update any existing contractor roles to member
UPDATE public.user_roles 
SET role = 'member' 
WHERE role = 'contractor';

UPDATE public.invites 
SET role = 'member' 
WHERE role = 'contractor';

-- Step 2: Drop ALL policies that reference app_role enum directly
-- user_roles table policies
DROP POLICY IF EXISTS "user_roles_delete_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;

-- personal_information table policies
DROP POLICY IF EXISTS "Owners can view personal information for company members" ON public.personal_information;
DROP POLICY IF EXISTS "Owners can update personal information for company members" ON public.personal_information;

-- profiles table policies that reference app_role
DROP POLICY IF EXISTS "Admins can delete company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update company profiles" ON public.profiles;

-- Step 3: Drop the has_role function that uses the old enum
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Step 4: Rename old enum and create new one
ALTER TYPE public.app_role RENAME TO app_role_old;

CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'project_manager', 'member');

-- Step 5: Update user_roles table to use the new enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role 
  USING role::text::public.app_role;

-- Step 6: Drop the old enum type
DROP TYPE public.app_role_old;

-- Step 7: Recreate the has_role function with new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 8: Recreate user_roles policies
CREATE POLICY "user_roles_delete_admin"
ON public.user_roles
FOR DELETE
USING (check_is_admin_for_user_roles(company_id) AND (role <> 'owner'::app_role));

CREATE POLICY "user_roles_insert_admin"
ON public.user_roles
FOR INSERT
WITH CHECK (check_is_admin_for_user_roles(company_id));

CREATE POLICY "user_roles_select_admin"
ON public.user_roles
FOR SELECT
USING (check_is_admin_for_user_roles(company_id));

CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "user_roles_update_admin"
ON public.user_roles
FOR UPDATE
USING (check_is_admin_for_user_roles(company_id))
WITH CHECK (check_is_admin_for_user_roles(company_id));

-- Step 9: Recreate personal_information policies
CREATE POLICY "Owners can view personal information for company members"
ON public.personal_information
FOR SELECT
USING (
  (company_id = get_user_company_id_safe()) AND 
  (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = personal_information.company_id 
      AND user_roles.role = 'owner'::app_role
  ))
);

CREATE POLICY "Owners can update personal information for company members"
ON public.personal_information
FOR UPDATE
USING (
  (company_id = get_user_company_id_safe()) AND 
  (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.company_id = personal_information.company_id 
      AND user_roles.role = 'owner'::app_role
  ))
);

-- Step 10: Recreate profiles policies
CREATE POLICY "Admins can delete company profiles"
ON public.profiles
FOR DELETE
USING (
  (company_id = get_my_company_id()) AND 
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
      AND ur.role = ANY (ARRAY['admin'::app_role, 'owner'::app_role])
  ))
);

CREATE POLICY "Admins can insert company profiles"
ON public.profiles
FOR INSERT
WITH CHECK (
  (company_id = get_my_company_id()) AND 
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
      AND ur.role = ANY (ARRAY['admin'::app_role, 'owner'::app_role])
  ))
);

CREATE POLICY "Admins can update company profiles"
ON public.profiles
FOR UPDATE
USING (
  (company_id = get_my_company_id()) AND 
  (EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() 
      AND ur.role = ANY (ARRAY['admin'::app_role, 'owner'::app_role])
  ))
);