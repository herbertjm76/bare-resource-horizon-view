-- Remove recursive SELECT policy on user_roles
DROP POLICY IF EXISTS "Company admins can view company roles" ON public.user_roles;
