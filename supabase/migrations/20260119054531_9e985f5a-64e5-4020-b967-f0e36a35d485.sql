-- Add abbreviation column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS abbreviation TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.projects.abbreviation IS 'Short form of project name used in space-constrained views (e.g., table headers)';