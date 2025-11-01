-- Create weekly_notes table for manual note entries
CREATE TABLE IF NOT EXISTS public.weekly_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  week_start_date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_notes ENABLE ROW LEVEL SECURITY;

-- Admins can manage weekly notes in their company
CREATE POLICY "Admins can manage weekly notes in their company"
ON public.weekly_notes
FOR ALL
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- Users can view weekly notes in their company
CREATE POLICY "Users can view weekly notes in their company"
ON public.weekly_notes
FOR SELECT
USING (company_id = get_user_company_id_safe());

-- Create updated_at trigger
CREATE TRIGGER update_weekly_notes_updated_at
  BEFORE UPDATE ON public.weekly_notes
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();