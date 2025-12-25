-- Add code column to office_stages table
ALTER TABLE public.office_stages 
ADD COLUMN code text;

-- Create an index for faster lookups by code
CREATE INDEX idx_office_stages_code ON public.office_stages(code);

-- Add unique constraint for code within a company
ALTER TABLE public.office_stages 
ADD CONSTRAINT office_stages_company_code_unique UNIQUE (company_id, code);