-- Add configurable allocation warning thresholds to companies table
ALTER TABLE public.companies
ADD COLUMN allocation_warning_threshold integer DEFAULT 150,
ADD COLUMN allocation_danger_threshold integer DEFAULT 180;

-- Add comment for documentation
COMMENT ON COLUMN public.companies.allocation_warning_threshold IS 'Percentage threshold for showing yellow warning on allocations (default 150%)';
COMMENT ON COLUMN public.companies.allocation_danger_threshold IS 'Percentage threshold for showing red danger warning on allocations (default 180%)';