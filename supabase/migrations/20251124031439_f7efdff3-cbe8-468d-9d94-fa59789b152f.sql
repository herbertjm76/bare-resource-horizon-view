-- Create project_statuses table for custom project status management
CREATE TABLE IF NOT EXISTS public.project_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT,
  order_index INTEGER NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_statuses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_statuses
CREATE POLICY "Admins can manage project statuses in their company"
  ON public.project_statuses
  FOR ALL
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can view project statuses in their company"
  ON public.project_statuses
  FOR SELECT
  USING (company_id = get_user_company_id_safe());

-- Create trigger for updated_at
CREATE TRIGGER set_project_statuses_updated_at
  BEFORE UPDATE ON public.project_statuses
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default statuses for existing companies
INSERT INTO public.project_statuses (name, color, order_index, company_id)
SELECT 'Planning', '#6366f1', 1, id FROM public.companies
UNION ALL
SELECT 'In Progress', '#22c55e', 2, id FROM public.companies
UNION ALL
SELECT 'On Hold', '#f59e0b', 3, id FROM public.companies
UNION ALL
SELECT 'Complete', '#8b5cf6', 4, id FROM public.companies;