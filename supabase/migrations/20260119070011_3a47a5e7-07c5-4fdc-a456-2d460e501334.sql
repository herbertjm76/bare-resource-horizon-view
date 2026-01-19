DROP POLICY IF EXISTS "Allow company creation during signup" ON public.companies;

CREATE POLICY "Allow company creation during signup"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);