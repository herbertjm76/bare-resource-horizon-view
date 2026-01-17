-- Fix: Allow admins/owners to insert roles for users in their company who don't have a role yet
-- This addresses the case where users exist without roles and admins need to assign them

-- First, let's check existing policies and add a clear one for admin role insertion
-- The existing policies seem to overlap, let's create a clean comprehensive policy

-- Drop potentially conflicting/duplicate policies first
DROP POLICY IF EXISTS "Admins can insert roles in their company" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage user_roles except owner" ON user_roles;

-- Create a clear policy: Owners/admins can insert any non-owner role for users in their company
CREATE POLICY "Owners and admins can assign roles to company members"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = get_user_company_id_safe()
  AND (user_is_admin_safe() OR user_has_owner_role(auth.uid()))
  AND role <> 'owner'
);

-- Also ensure owners can assign owner role (for ownership transfer)
CREATE POLICY "Owners can assign owner role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = get_user_company_id_safe()
  AND user_has_owner_role(auth.uid())
  AND role = 'owner'
);