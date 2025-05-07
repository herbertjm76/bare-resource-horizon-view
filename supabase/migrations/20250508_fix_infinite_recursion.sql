
-- Drop problematic policies with recursive queries
DROP POLICY IF EXISTS "Company admins/owners can view all company profiles" ON public.profiles;

-- Create a non-recursive policy for admin/owner permissions
-- This uses our security definer function which prevents recursion
CREATE POLICY "Company admins/owners can view all company profiles"
ON public.profiles
FOR SELECT
USING (
  public.get_user_role(auth.uid()) IN ('admin', 'owner') 
  AND public.users_are_in_same_company(auth.uid(), id)
);

-- Similarly fix the update policy
DROP POLICY IF EXISTS "Company owners can update company profiles" ON public.profiles;

CREATE POLICY "Company owners can update company profiles"
ON public.profiles
FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'owner' 
  AND public.users_are_in_same_company(auth.uid(), id)
);
