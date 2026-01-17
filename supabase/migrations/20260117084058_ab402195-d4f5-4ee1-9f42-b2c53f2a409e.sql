-- Fix infinite recursion in user_roles policies
-- The issue is the user_roles_select_company policy queries profiles, causing recursion

-- Drop ALL existing policies on user_roles to start fresh
DROP POLICY IF EXISTS "user_roles_delete_by_admin" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_admin" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_by_admin" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own" ON user_roles;
DROP POLICY IF EXISTS "user_roles_select_company" ON user_roles;
DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update_by_admin" ON user_roles;

-- Create clean, non-recursive policies using existing SECURITY DEFINER function

-- SELECT: Users can see their own role
CREATE POLICY "user_roles_select_own" ON user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- SELECT: Admins/owners can see all roles in their company
CREATE POLICY "user_roles_select_admin" ON user_roles
FOR SELECT TO authenticated
USING (public.check_is_admin_for_user_roles(company_id));

-- INSERT: Admins/owners can insert roles (for upsert)
CREATE POLICY "user_roles_insert_admin" ON user_roles
FOR INSERT TO authenticated
WITH CHECK (public.check_is_admin_for_user_roles(company_id));

-- UPDATE: Admins/owners can update roles
CREATE POLICY "user_roles_update_admin" ON user_roles
FOR UPDATE TO authenticated
USING (public.check_is_admin_for_user_roles(company_id))
WITH CHECK (public.check_is_admin_for_user_roles(company_id));

-- DELETE: Admins/owners can delete roles (but not owner roles)
CREATE POLICY "user_roles_delete_admin" ON user_roles
FOR DELETE TO authenticated
USING (public.check_is_admin_for_user_roles(company_id) AND role <> 'owner');