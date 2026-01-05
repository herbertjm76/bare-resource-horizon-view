-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view company by subdomain for join pages" ON public.companies;

-- Create a new restrictive policy that only allows public to view companies when filtering by subdomain
-- This leverages the fact that the query must include a subdomain filter to match any rows
CREATE POLICY "Public can view company by subdomain only" 
ON public.companies 
FOR SELECT 
USING (
  -- Allow if user is authenticated (they have other policies for full access)
  auth.uid() IS NOT NULL
  OR
  -- Allow unauthenticated users ONLY when querying by subdomain (for join pages)
  -- RLS can't restrict columns, but the policy requires subdomain in the filter
  true
);

-- Actually, the above still allows full public access. Let's use a different approach:
-- Drop the new policy we just created
DROP POLICY IF EXISTS "Public can view company by subdomain only" ON public.companies;

-- The proper fix is to NOT have a public policy at all for full row access.
-- Instead, create a database function that returns limited company info for public use.

-- Create a secure function for public company lookups
CREATE OR REPLACE FUNCTION public.get_company_by_subdomain(subdomain_param text)
RETURNS TABLE (
  id uuid,
  name text,
  logo_url text,
  subdomain text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.logo_url,
    c.subdomain
  FROM companies c
  WHERE c.subdomain = subdomain_param;
END;
$$;

-- Create a function to check subdomain availability (returns count only)
CREATE OR REPLACE FUNCTION public.check_subdomain_available(subdomain_param text)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  subdomain_count integer;
BEGIN
  SELECT COUNT(*) INTO subdomain_count
  FROM companies
  WHERE subdomain = lower(subdomain_param);
  
  RETURN subdomain_count = 0;
END;
$$;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_company_by_subdomain(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_company_by_subdomain(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_subdomain_available(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_subdomain_available(text) TO authenticated;