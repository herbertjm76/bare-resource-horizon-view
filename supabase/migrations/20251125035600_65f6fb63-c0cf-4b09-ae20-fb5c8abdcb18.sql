
-- Create office_project_types table
CREATE TABLE IF NOT EXISTS public.office_project_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.office_project_types ENABLE ROW LEVEL SECURITY;

-- Create policies for project types
CREATE POLICY "Admins can manage project types in their company"
  ON public.office_project_types
  FOR ALL
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can view project types in their company"
  ON public.office_project_types
  FOR SELECT
  USING (company_id = get_user_company_id_safe());

-- Create index for better query performance
CREATE INDEX idx_office_project_types_company_id ON public.office_project_types(company_id);
CREATE INDEX idx_office_project_types_order ON public.office_project_types(company_id, order_index);

-- Add trigger for updated_at
CREATE TRIGGER update_office_project_types_updated_at
  BEFORE UPDATE ON public.office_project_types
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
