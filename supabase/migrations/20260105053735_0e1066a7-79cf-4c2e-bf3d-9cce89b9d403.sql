-- Create a function that returns profiles with masked emails for non-admin users
-- Admins, owners, and users viewing their own profile see full emails
-- Regular users see masked emails (e.g., "jo***@company.com")

CREATE OR REPLACE FUNCTION public.get_profiles_secure(p_company_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  company_id uuid,
  department text,
  location text,
  job_title text,
  weekly_capacity numeric,
  office_role_id uuid,
  practice_area text,
  bio text,
  date_of_birth date,
  start_date date,
  manager_id uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_company_id uuid;
  v_is_admin boolean;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- If no authenticated user, return empty
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Get the company ID to filter by
  IF p_company_id IS NOT NULL THEN
    v_company_id := p_company_id;
  ELSE
    -- Get user's company from their profile
    SELECT p.company_id INTO v_company_id
    FROM profiles p
    WHERE p.id = v_user_id;
  END IF;
  
  -- If no company found, return empty
  IF v_company_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Check if user is admin or owner
  v_is_admin := EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = v_user_id
    AND ur.company_id = v_company_id
    AND ur.role IN ('admin', 'owner')
  );
  
  -- Return profiles with conditional email masking
  RETURN QUERY
  SELECT 
    p.id,
    -- Mask email unless user is admin/owner or viewing own profile
    CASE 
      WHEN p.id = v_user_id THEN p.email
      WHEN v_is_admin THEN p.email
      ELSE 
        -- Mask email: show first 2 chars, then ***, then @domain
        CASE 
          WHEN length(split_part(p.email, '@', 1)) > 2 THEN
            substring(p.email from 1 for 2) || '***@' || split_part(p.email, '@', 2)
          ELSE
            '***@' || split_part(p.email, '@', 2)
        END
    END::text as email,
    p.first_name::text,
    p.last_name::text,
    p.avatar_url::text,
    p.company_id,
    p.department::text,
    p.location::text,
    p.job_title::text,
    p.weekly_capacity,
    p.office_role_id,
    p.practice_area::text,
    p.bio::text,
    p.date_of_birth,
    p.start_date,
    p.manager_id,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.company_id = v_company_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_profiles_secure(uuid) TO authenticated;