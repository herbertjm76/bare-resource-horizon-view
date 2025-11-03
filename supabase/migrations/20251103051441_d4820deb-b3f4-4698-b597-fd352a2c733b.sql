-- Relax companies insert RLS to unblock signup reliably
-- Drop previous insert policy if exists
DROP POLICY IF EXISTS "Allow company creation during signup" ON public.companies;

-- Create a simpler permissive policy: allow both anon and authenticated callers to insert
CREATE POLICY "Allow anon or authenticated to insert companies (signup)"
ON public.companies
FOR INSERT
WITH CHECK (
  auth.role() IN ('anon', 'authenticated')
);
