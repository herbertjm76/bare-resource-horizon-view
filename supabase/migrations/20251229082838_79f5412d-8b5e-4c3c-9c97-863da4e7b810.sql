-- Server-side approver list that excludes pending invites (no auth.users row)
CREATE OR REPLACE FUNCTION public.get_company_leave_approvers(p_company_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  role text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH ranked_roles AS (
    SELECT
      ur.user_id,
      ur.role::text AS role,
      ROW_NUMBER() OVER (
        PARTITION BY ur.user_id
        ORDER BY
          CASE
            WHEN ur.role = 'owner' THEN 3
            WHEN ur.role = 'admin' THEN 2
            WHEN ur.role = 'project_manager' THEN 1
            ELSE 0
          END DESC
      ) AS rn
    FROM public.user_roles ur
    WHERE ur.company_id = p_company_id
      AND ur.role IN ('owner'::public.app_role, 'admin'::public.app_role, 'project_manager'::public.app_role)
  )
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    rr.role
  FROM ranked_roles rr
  -- Crucial: only users that actually exist in auth (i.e., accepted invite / signed up)
  JOIN auth.users au ON au.id = rr.user_id
  JOIN public.profiles p ON p.id = rr.user_id
  WHERE rr.rn = 1
  ORDER BY COALESCE(p.first_name, ''), COALESCE(p.last_name, ''), p.email;
$$;

-- Lock down function execution to authenticated users
REVOKE ALL ON FUNCTION public.get_company_leave_approvers(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_company_leave_approvers(uuid) TO authenticated;