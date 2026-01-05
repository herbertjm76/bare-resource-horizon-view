-- Fix get_user_company_id_safe to use proper search_path
CREATE OR REPLACE FUNCTION public.get_user_company_id_safe()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Drop all existing profiles policies to recreate them without recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Company members can view profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Project managers can view team profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles in their company" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Company members can view company profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can insert company profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update company profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete company profiles" ON profiles;

-- Create new non-recursive policies for profiles table
-- Users can always view their own profile (no recursion, direct auth.uid() check)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Company members can view profiles of people in the same company
-- Uses inline subquery instead of get_user_company_id_safe() to avoid recursion
CREATE POLICY "Company members can view company profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    company_id IS NOT NULL AND
    company_id = (SELECT p.company_id FROM profiles p WHERE p.id = auth.uid())
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can insert profiles in their company
CREATE POLICY "Admins can insert company profiles" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = (SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()) AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'owner')
    )
  );

-- Admins can update profiles in their company
CREATE POLICY "Admins can update company profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (
    company_id = (SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()) AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'owner')
    )
  );

-- Admins can delete profiles in their company
CREATE POLICY "Admins can delete company profiles" ON profiles
  FOR DELETE TO authenticated
  USING (
    company_id = (SELECT p.company_id FROM profiles p WHERE p.id = auth.uid()) AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'owner')
    )
  );