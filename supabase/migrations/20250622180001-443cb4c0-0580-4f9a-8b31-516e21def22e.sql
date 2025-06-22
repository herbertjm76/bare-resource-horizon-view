
-- Create a table for tracking weekly other leave (sick, training, etc.)
CREATE TABLE IF NOT EXISTS public.weekly_other_leave (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  company_id UUID NOT NULL,
  week_start_date DATE NOT NULL,
  hours NUMERIC NOT NULL DEFAULT 0,
  leave_type TEXT NOT NULL DEFAULT 'other',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.weekly_other_leave ENABLE ROW LEVEL SECURITY;

-- Create policy for company members to view their company's data
CREATE POLICY "Company members can view weekly other leave" 
  ON public.weekly_other_leave 
  FOR SELECT 
  USING (company_id = get_current_user_company_id());

-- Create policy for company members to insert their company's data
CREATE POLICY "Company members can create weekly other leave" 
  ON public.weekly_other_leave 
  FOR INSERT 
  WITH CHECK (company_id = get_current_user_company_id());

-- Create policy for company members to update their company's data
CREATE POLICY "Company members can update weekly other leave" 
  ON public.weekly_other_leave 
  FOR UPDATE 
  USING (company_id = get_current_user_company_id());

-- Create policy for company members to delete their company's data
CREATE POLICY "Company members can delete weekly other leave" 
  ON public.weekly_other_leave 
  FOR DELETE 
  USING (company_id = get_current_user_company_id());

-- Create an index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_weekly_other_leave_member_week 
  ON public.weekly_other_leave (member_id, week_start_date);

-- Create an index for company queries
CREATE INDEX IF NOT EXISTS idx_weekly_other_leave_company 
  ON public.weekly_other_leave (company_id);

-- Add trigger for updating the updated_at timestamp
CREATE OR REPLACE TRIGGER update_weekly_other_leave_updated_at
  BEFORE UPDATE ON public.weekly_other_leave
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
