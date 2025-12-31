-- Make target_profit_percentage nullable so it's not required
ALTER TABLE public.projects 
ALTER COLUMN target_profit_percentage DROP NOT NULL;

-- Set a default value for convenience
ALTER TABLE public.projects 
ALTER COLUMN target_profit_percentage SET DEFAULT 0;