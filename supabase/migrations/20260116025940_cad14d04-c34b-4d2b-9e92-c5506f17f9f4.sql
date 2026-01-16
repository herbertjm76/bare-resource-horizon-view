-- Create RPC function to get leave approvers (users with owner, admin, or project_manager roles)
CREATE OR REPLACE FUNCTION public.get_company_leave_approvers(p_company_id UUID)
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.avatar_url,
    ur.role::TEXT
  FROM profiles p
  INNER JOIN user_roles ur ON ur.user_id = p.id AND ur.company_id = p_company_id
  WHERE p.company_id = p_company_id
    AND ur.role IN ('owner', 'admin', 'project_manager')
  ORDER BY p.first_name, p.last_name;
END;
$$;