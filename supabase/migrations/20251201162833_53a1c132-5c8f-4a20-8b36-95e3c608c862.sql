-- Add app settings fields to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS work_week_hours INTEGER DEFAULT 40,
ADD COLUMN IF NOT EXISTS use_hours_or_percentage TEXT DEFAULT 'hours' CHECK (use_hours_or_percentage IN ('hours', 'percentage')),
ADD COLUMN IF NOT EXISTS start_of_work_week TEXT DEFAULT 'Monday' CHECK (start_of_work_week IN ('Monday', 'Sunday', 'Saturday')),
ADD COLUMN IF NOT EXISTS opt_out_financials BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS project_display_preference TEXT DEFAULT 'code' CHECK (project_display_preference IN ('code', 'name'));