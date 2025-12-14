-- Add configurable maximum allocation limit
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS allocation_max_limit integer DEFAULT 200;