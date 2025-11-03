-- Re-enable RLS on companies and fix the user profile link issue
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for company inserts during signup
CREATE POLICY "Allow anon and authenticated company creation" 
ON public.companies 
FOR INSERT 
WITH CHECK (true);

-- Update the profile to link to the TEST company for stan@hksinc.com
UPDATE public.profiles 
SET company_id = 'e034bab7-79bc-4e1b-a7e1-424fef9dee5c' 
WHERE email = 'stan@hksinc.com' AND company_id IS NULL;