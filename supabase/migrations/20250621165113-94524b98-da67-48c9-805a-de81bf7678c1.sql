
-- Drop the existing problematic RLS policy that references auth.users
DROP POLICY IF EXISTS "Users can only see invites from their company" ON public.invites;

-- Create a security definer function to get the current user's company_id safely
CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Create new RLS policies for the invites table using the security definer function
CREATE POLICY "Users can view invites from their company" 
  ON public.invites 
  FOR SELECT 
  USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can insert invites to their company" 
  ON public.invites 
  FOR INSERT 
  WITH CHECK (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update invites from their company" 
  ON public.invites 
  FOR UPDATE 
  USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can delete invites from their company" 
  ON public.invites 
  FOR DELETE 
  USING (company_id = public.get_current_user_company_id());

-- Enable RLS on the invites table if it's not already enabled
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
