-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can view pending invites by code" ON public.invites;

-- Create a secure RPC function that only returns invite data when the exact code is provided
CREATE OR REPLACE FUNCTION public.get_invite_by_code(invite_code text)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  company_id uuid,
  invitation_type text,
  role text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'pg_catalog', 'public'
AS $$
BEGIN
  -- Only return invite if code matches exactly and status is pending
  RETURN QUERY
  SELECT 
    i.id,
    i.email,
    i.first_name,
    i.last_name,
    i.company_id,
    i.invitation_type,
    i.role,
    i.status
  FROM public.invites i
  WHERE i.code = invite_code
    AND i.status = 'pending';
END;
$$;

-- Grant execute permission to anonymous users (for join page)
GRANT EXECUTE ON FUNCTION public.get_invite_by_code(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_invite_by_code(text) TO authenticated;