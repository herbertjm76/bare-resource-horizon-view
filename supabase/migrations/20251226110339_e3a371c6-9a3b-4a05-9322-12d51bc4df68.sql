-- Add office_role_id column to profiles table
-- This links team members to their office role for rate lookup

ALTER TABLE public.profiles 
ADD COLUMN office_role_id uuid REFERENCES public.office_roles(id) ON DELETE SET NULL;

-- Create an index for faster lookups
CREATE INDEX idx_profiles_office_role_id ON public.profiles(office_role_id);

-- Add the same column to invites for pre-registered members
ALTER TABLE public.invites 
ADD COLUMN office_role_id uuid REFERENCES public.office_roles(id) ON DELETE SET NULL;

-- Create an index for faster lookups on invites
CREATE INDEX idx_invites_office_role_id ON public.invites(office_role_id);