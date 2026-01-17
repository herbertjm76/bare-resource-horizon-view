-- Add UPDATE policy for user_roles to allow admins/owners to update roles
-- This fixes the "Failed to save changes" error when editing roles

-- First, drop any existing UPDATE policy on user_roles to avoid conflicts
DROP POLICY IF EXISTS "Admins can update user roles" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON user_roles;

-- Create UPDATE policy for admins/owners
CREATE POLICY "user_roles_update_admin" ON user_roles
FOR UPDATE TO authenticated
USING (public.check_is_admin_for_user_roles(company_id))
WITH CHECK (public.check_is_admin_for_user_roles(company_id));

-- Also ensure INSERT policy exists for upserts
DROP POLICY IF EXISTS "Admins can insert user roles" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_admin" ON user_roles;

CREATE POLICY "user_roles_insert_admin" ON user_roles
FOR INSERT TO authenticated
WITH CHECK (public.check_is_admin_for_user_roles(company_id));