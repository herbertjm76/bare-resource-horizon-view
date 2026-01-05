-- Create a helper function that bypasses RLS to prevent recursion
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT company_id
  FROM public.profiles
  WHERE id = auth.uid();
$$;

-- Drop all existing policies on profiles
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

-- Recreate policies using the safe helper function (bypasses RLS)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Company members can view company profiles" ON profiles
  FOR SELECT TO authenticated
  USING (company_id IS NOT NULL AND company_id = public.get_my_company_id());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert company profiles" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.get_my_company_id() AND
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'owner'))
  );

CREATE POLICY "Admins can update company profiles" ON profiles
  FOR UPDATE TO authenticated
  USING (
    company_id = public.get_my_company_id() AND
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'owner'))
  );

CREATE POLICY "Admins can delete company profiles" ON profiles
  FOR DELETE TO authenticated
  USING (
    company_id = public.get_my_company_id() AND
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'owner'))
  );