-- Function to auto-assign roles (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.auto_assign_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_role app_role;
BEGIN
  -- Skip if no company_id (user not associated with a company yet)
  IF NEW.company_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Check if user already has a role for this company
  IF EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = NEW.id AND company_id = NEW.company_id
  ) THEN
    RETURN NEW;
  END IF;

  -- Check if there's an invite with a role
  SELECT role INTO v_role
  FROM invites
  WHERE email = NEW.email 
    AND company_id = NEW.company_id
    AND status IN ('pending', 'accepted')
  ORDER BY 
    CASE WHEN status = 'accepted' THEN 0 ELSE 1 END,
    updated_at DESC
  LIMIT 1;

  -- If no invite found, check if this is the first user (owner)
  IF v_role IS NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_roles WHERE company_id = NEW.company_id
    ) THEN
      v_role := 'owner';
    ELSE
      v_role := 'member';
    END IF;
  END IF;

  -- Insert the role
  INSERT INTO user_roles (user_id, company_id, role)
  VALUES (NEW.id, NEW.company_id, v_role)
  ON CONFLICT (user_id, company_id) DO NOTHING;

  RAISE LOG 'auto_assign_user_role: Assigned role % to user % for company %', v_role, NEW.id, NEW.company_id;

  RETURN NEW;
END;
$$;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS trigger_auto_assign_user_role ON profiles;

CREATE TRIGGER trigger_auto_assign_user_role
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_user_role();

-- Also trigger on profile UPDATE when company_id changes (user joins a company)
CREATE OR REPLACE FUNCTION public.auto_assign_user_role_on_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
BEGIN
  -- Only run if company_id changed from NULL to a value
  IF OLD.company_id IS NULL AND NEW.company_id IS NOT NULL THEN
    -- Check if user already has a role for this company
    IF EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = NEW.id AND company_id = NEW.company_id
    ) THEN
      RETURN NEW;
    END IF;

    -- Check if there's an invite with a role
    SELECT role INTO v_role
    FROM invites
    WHERE email = NEW.email 
      AND company_id = NEW.company_id
      AND status IN ('pending', 'accepted')
    ORDER BY 
      CASE WHEN status = 'accepted' THEN 0 ELSE 1 END,
      updated_at DESC
    LIMIT 1;

    -- If no invite found, check if this is the first user (owner)
    IF v_role IS NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM user_roles WHERE company_id = NEW.company_id
      ) THEN
        v_role := 'owner';
      ELSE
        v_role := 'member';
      END IF;
    END IF;

    -- Insert the role
    INSERT INTO user_roles (user_id, company_id, role)
    VALUES (NEW.id, NEW.company_id, v_role)
    ON CONFLICT (user_id, company_id) DO NOTHING;

    RAISE LOG 'auto_assign_user_role_on_update: Assigned role % to user % for company %', v_role, NEW.id, NEW.company_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_assign_user_role_on_update ON profiles;

CREATE TRIGGER trigger_auto_assign_user_role_on_update
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_user_role_on_update();

-- Add RLS policy allowing users to insert their own role during signup (fallback)
DROP POLICY IF EXISTS "Users can insert own role during signup" ON user_roles;

CREATE POLICY "Users can insert own role during signup"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.company_id = user_roles.company_id
  )
);

-- Verification function for debugging role issues
CREATE OR REPLACE FUNCTION public.verify_user_role_setup(p_user_id UUID)
RETURNS TABLE(
  has_profile BOOLEAN,
  profile_company_id UUID,
  has_role BOOLEAN,
  role_value TEXT,
  role_company_id UUID
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    EXISTS(SELECT 1 FROM profiles WHERE id = p_user_id),
    (SELECT company_id FROM profiles WHERE id = p_user_id),
    EXISTS(SELECT 1 FROM user_roles WHERE user_id = p_user_id),
    (SELECT role::TEXT FROM user_roles WHERE user_id = p_user_id LIMIT 1),
    (SELECT company_id FROM user_roles WHERE user_id = p_user_id LIMIT 1)
$$;