-- =====================================================
-- COMPREHENSIVE FIX: Role Assignment & RLS Cleanup
-- =====================================================

-- Part 1: Fix the unique constraint on user_roles
-- Change from UNIQUE (user_id, role, company_id) to UNIQUE (user_id, company_id)
-- =====================================================

-- First, clean up any duplicate rows (keep highest precedence role)
DELETE FROM user_roles a
USING user_roles b
WHERE a.user_id = b.user_id
  AND a.company_id = b.company_id
  AND a.id <> b.id
  AND (
    (a.role = 'member' AND b.role IN ('owner', 'admin', 'project_manager', 'contractor'))
    OR (a.role = 'contractor' AND b.role IN ('owner', 'admin', 'project_manager', 'member'))
    OR (a.role = 'project_manager' AND b.role IN ('owner', 'admin'))
    OR (a.role = 'admin' AND b.role = 'owner')
  );

-- Drop the old constraint that includes role
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_company_id_key;

-- Add the correct constraint (one role per user per company)
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_company_id_key 
  UNIQUE (user_id, company_id);

-- =====================================================
-- Part 2: Fix handle_new_user trigger to handle ALL invite types
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  role_value app_role;
  company_id_value UUID;
  invite RECORD;
BEGIN
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  
  -- Check for ANY pending invite (not just pre_registered!)
  SELECT * INTO invite 
  FROM public.invites 
  WHERE email = NEW.email 
    AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Get role from invite first, then metadata, then default to member
  IF invite.id IS NOT NULL AND invite.role IS NOT NULL THEN
    role_value := invite.role::app_role;
  ELSIF NEW.raw_user_meta_data->>'role' IS NOT NULL 
        AND NEW.raw_user_meta_data->>'role' IN ('owner', 'admin', 'member', 'project_manager', 'contractor') THEN
    role_value := (NEW.raw_user_meta_data->>'role')::app_role;
  ELSE
    role_value := 'member';
  END IF;
  
  IF invite.id IS NOT NULL THEN
    company_id_value := invite.company_id;
    
    -- Mark invite as accepted
    UPDATE public.invites
    SET status = 'accepted', accepted_at = now(), accepted_by = NEW.id
    WHERE id = invite.id;
    
    -- Create profile with data from invite
    INSERT INTO public.profiles (
      id, email, first_name, last_name, company_id,
      job_title, department, location
    )
    VALUES (
      NEW.id, NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', invite.first_name),
      COALESCE(NEW.raw_user_meta_data->>'last_name', invite.last_name),
      company_id_value,
      invite.job_title, invite.department, invite.location
    );
    
    -- Add role from the INVITE to user_roles table (UPSERT)
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, role_value, company_id_value)
    ON CONFLICT (user_id, company_id) DO UPDATE SET role = EXCLUDED.role;
    
    -- Handle resource allocations for pre_registered invites
    IF invite.invitation_type = 'pre_registered' THEN
      UPDATE public.project_resource_allocations
      SET resource_id = NEW.id, resource_type = 'active', updated_at = now()
      WHERE resource_id = invite.id AND resource_type = 'pre_registered';
      
      INSERT INTO public.project_resources (staff_id, project_id, company_id, hours)
      SELECT NEW.id, project_id, company_id, hours
      FROM public.pending_resources
      WHERE invite_id = invite.id;
      
      DELETE FROM public.pending_resources WHERE invite_id = invite.id;
    END IF;
    
  ELSE
    -- No invite found - create profile with optional company from metadata
    BEGIN
      IF NEW.raw_user_meta_data->>'company_id' IS NOT NULL THEN
        company_id_value := (NEW.raw_user_meta_data->>'company_id')::UUID;
      ELSE
        company_id_value := NULL;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      company_id_value := NULL;
    END;
    
    INSERT INTO public.profiles (
      id, email, first_name, last_name, company_id
    )
    VALUES (
      NEW.id, NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      company_id_value
    );
    
    IF company_id_value IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role, company_id)
      VALUES (NEW.id, role_value, company_id_value)
      ON CONFLICT (user_id, company_id) DO UPDATE SET role = EXCLUDED.role;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- =====================================================
-- Part 3: Fix missing roles for existing users (bypass RLS)
-- =====================================================

-- Create a function to fix missing user_roles (runs with elevated privileges)
CREATE OR REPLACE FUNCTION public.fix_missing_user_roles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
SET row_security = 'off'
AS $$
BEGIN
  -- Insert roles for users who have accepted invites but no user_role entry
  INSERT INTO user_roles (user_id, company_id, role)
  SELECT 
    p.id,
    p.company_id,
    COALESCE(i.role::app_role, 'member'::app_role)
  FROM profiles p
  LEFT JOIN invites i ON i.email = p.email 
    AND i.company_id = p.company_id 
    AND i.status = 'accepted'
  WHERE p.company_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = p.id AND ur.company_id = p.company_id
    )
  ON CONFLICT (user_id, company_id) DO NOTHING;
END;
$$;

-- Run it immediately
SELECT public.fix_missing_user_roles();

-- Clean up
DROP FUNCTION IF EXISTS public.fix_missing_user_roles();

-- =====================================================
-- Part 4: Clean up duplicate invites RLS policies
-- =====================================================

-- Drop all existing invites policies
DROP POLICY IF EXISTS "Admins can create invites" ON invites;
DROP POLICY IF EXISTS "Admins can create invites in their company" ON invites;
DROP POLICY IF EXISTS "Admins can delete invites" ON invites;
DROP POLICY IF EXISTS "Admins can delete invites in their company" ON invites;
DROP POLICY IF EXISTS "Admins can update invites" ON invites;
DROP POLICY IF EXISTS "Admins can update invites in their company" ON invites;
DROP POLICY IF EXISTS "Admins can view company invites" ON invites;
DROP POLICY IF EXISTS "Admins can view invites" ON invites;
DROP POLICY IF EXISTS "Admins can view invites in their company" ON invites;
DROP POLICY IF EXISTS "Users can accept invites" ON invites;
DROP POLICY IF EXISTS "Users can create invites for their company" ON invites;
DROP POLICY IF EXISTS "Users can delete invites for their company" ON invites;
DROP POLICY IF EXISTS "Users can delete invites from their company" ON invites;
DROP POLICY IF EXISTS "Users can insert invites to their company" ON invites;
DROP POLICY IF EXISTS "Users can update invites from their company" ON invites;
DROP POLICY IF EXISTS "Users can view invites from their company" ON invites;
DROP POLICY IF EXISTS "Users can view invites in their company" ON invites;

-- Create clean policies (admin-only management per user preference)
CREATE POLICY "invites_select_admin" ON invites FOR SELECT TO authenticated
  USING (company_id = get_my_company_id() AND check_is_admin_for_user_roles(company_id));

CREATE POLICY "invites_select_own" ON invites FOR SELECT TO authenticated
  USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

CREATE POLICY "invites_insert_admin" ON invites FOR INSERT TO authenticated
  WITH CHECK (company_id = get_my_company_id() AND check_is_admin_for_user_roles(company_id));

CREATE POLICY "invites_update_admin" ON invites FOR UPDATE TO authenticated
  USING (company_id = get_my_company_id() AND check_is_admin_for_user_roles(company_id));

CREATE POLICY "invites_update_own" ON invites FOR UPDATE TO authenticated
  USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

CREATE POLICY "invites_delete_admin" ON invites FOR DELETE TO authenticated
  USING (company_id = get_my_company_id() AND check_is_admin_for_user_roles(company_id));