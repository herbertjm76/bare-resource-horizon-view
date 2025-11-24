-- Fix the "Users can accept invites" policy to avoid querying auth.users
-- The issue is that the policy tries to access auth.users which causes a permission error

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can accept invites" ON public.invites;

-- Create a new policy that doesn't query auth.users
-- Instead, we check if the invite's email matches the current user's email from profiles
CREATE POLICY "Users can accept invites" 
ON public.invites 
FOR UPDATE 
USING (
  (email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
  OR 
  (code IS NOT NULL)
);