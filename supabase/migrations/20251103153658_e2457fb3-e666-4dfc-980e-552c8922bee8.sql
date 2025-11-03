-- Drop the existing restrictive INSERT policy for companies
DROP POLICY IF EXISTS "Authenticated users can create companies during signup" ON public.companies;

-- Create a new policy that allows both authenticated and anonymous users to create companies
-- This is necessary for the signup flow where company is created before user authentication
CREATE POLICY "Allow company creation during signup"
ON public.companies
FOR INSERT
TO public
WITH CHECK (true);

-- Add a comment explaining why this policy exists
COMMENT ON POLICY "Allow company creation during signup" ON public.companies IS 
'Allows anonymous and authenticated users to create companies. Required for signup flow where company is created before user authentication completes.';