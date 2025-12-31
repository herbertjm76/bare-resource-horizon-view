-- Add start_date column to project_stages table for individual stage scheduling
ALTER TABLE public.project_stages
ADD COLUMN start_date DATE NULL;

-- Add a comment to explain the purpose
COMMENT ON COLUMN public.project_stages.start_date IS 'Optional start date for the stage to allow custom timeline positioning';