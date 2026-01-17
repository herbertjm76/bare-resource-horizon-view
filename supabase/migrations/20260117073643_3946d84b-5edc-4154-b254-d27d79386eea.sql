-- Fix infinite recursion in user_roles policies
-- The issue is that policies call functions that query user_roles, which triggers the policy again

-- Step 1: Drop all duplicate and problematic policies
DROP POLICY IF EXISTS "Admins can delete non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles in their company" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete user_roles except owner" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles in their company" ON user_roles;
DROP POLICY IF EXISTS "Admins can update user_roles except owner" ON user_roles;
DROP POLICY IF EXISTS "Admins can view company roles" ON user_roles;
DROP POLICY IF EXISTS "Owners and admins can assign roles to company members" ON user_roles;
DROP POLICY IF EXISTS "Owners can assign owner role" ON user_roles;
DROP POLICY IF EXISTS "Owners can manage owner roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own role during signup" ON user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles in their company" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;

-- Step 2: Create a SECURITY DEFINER function that checks admin status WITHOUT triggering RLS
-- This function bypasses RLS by using security definer and explicitly setting row_security off
CREATE OR REPLACE FUNCTION public.check_is_admin_for_user_roles(check_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
SET row_security = 'off'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
      AND company_id = check_company_id
      AND role IN ('admin', 'owner')
  )
$$;

-- Step 3: Create clean, non-recursive policies

-- SELECT: Users can view their own role
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- SELECT: Users can view roles in their company (uses profiles which doesn't trigger user_roles RLS)
CREATE POLICY "user_roles_select_company"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
);

-- INSERT: Allow during signup (user can insert their own role if they don't have one)
CREATE POLICY "user_roles_insert_own"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.company_id = user_roles.company_id
  )
);

-- INSERT: Admins/owners can assign roles to company members (uses security definer function)
CREATE POLICY "user_roles_insert_by_admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  check_is_admin_for_user_roles(company_id)
  AND (role <> 'owner' OR check_is_admin_for_user_roles(company_id))
);

-- UPDATE: Admins can update roles (except owner role unless they are owner)
CREATE POLICY "user_roles_update_by_admin"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (check_is_admin_for_user_roles(company_id))
WITH CHECK (
  check_is_admin_for_user_roles(company_id)
  AND role <> 'owner'
);

-- DELETE: Admins can delete non-owner roles
CREATE POLICY "user_roles_delete_by_admin"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  check_is_admin_for_user_roles(company_id)
  AND role <> 'owner'
);