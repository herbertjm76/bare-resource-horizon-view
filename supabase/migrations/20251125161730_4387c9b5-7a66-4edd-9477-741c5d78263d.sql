-- Add practice_area column to profiles table
ALTER TABLE public.profiles
ADD COLUMN practice_area TEXT;

-- Add practice_area column to invites table
ALTER TABLE public.invites
ADD COLUMN practice_area TEXT;

-- Add comment to document the columns
COMMENT ON COLUMN public.profiles.practice_area IS 'References office_practice_areas by name';
COMMENT ON COLUMN public.invites.practice_area IS 'References office_practice_areas by name';