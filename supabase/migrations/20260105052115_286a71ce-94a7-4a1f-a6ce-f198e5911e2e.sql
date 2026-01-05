-- Now properly restrict public access - only authenticated users can read companies
-- The public functions we created will handle unauthenticated access for specific use cases

-- First ensure there's no public policy left
DROP POLICY IF EXISTS "Public can view company by subdomain for join pages" ON public.companies;
DROP POLICY IF EXISTS "Public can view company by subdomain only" ON public.companies;

-- The existing "Users can view their own company" policy handles authenticated access
-- No additional policy needed - public access is now blocked