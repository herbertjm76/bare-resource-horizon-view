-- Add rate basis strategy to projects table
ALTER TABLE public.projects 
ADD COLUMN rate_basis_strategy text DEFAULT 'role_based' CHECK (rate_basis_strategy IN ('role_based', 'location_based'));

-- Create project stage team composition table
CREATE TABLE public.project_stage_team_composition (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES public.office_stages(id) ON DELETE CASCADE,
  reference_id uuid NOT NULL, -- References either office_roles.id or office_locations.id
  reference_type text NOT NULL CHECK (reference_type IN ('role', 'location')),
  planned_quantity integer NOT NULL DEFAULT 1,
  rate_snapshot numeric NOT NULL DEFAULT 0,
  planned_hours_per_person numeric NOT NULL DEFAULT 0,
  total_planned_hours numeric GENERATED ALWAYS AS (planned_quantity * planned_hours_per_person) STORED,
  total_budget_amount numeric GENERATED ALWAYS AS (planned_quantity * planned_hours_per_person * rate_snapshot) STORED,
  company_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, stage_id, reference_id, reference_type)
);

-- Enable RLS on project_stage_team_composition
ALTER TABLE public.project_stage_team_composition ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_stage_team_composition
CREATE POLICY "Admins can manage team composition in their company" 
ON public.project_stage_team_composition 
FOR ALL 
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can view team composition in their company" 
ON public.project_stage_team_composition 
FOR SELECT 
USING (company_id = get_user_company_id_safe());

-- Enhance project_resource_allocations with stage tracking
ALTER TABLE public.project_resource_allocations 
ADD COLUMN stage_id uuid REFERENCES public.office_stages(id),
ADD COLUMN rate_snapshot numeric DEFAULT 0,
ADD COLUMN allocation_amount numeric GENERATED ALWAYS AS (hours * rate_snapshot) STORED;

-- Add calculated fields to project_stages for budget tracking
ALTER TABLE public.project_stages 
ADD COLUMN total_budgeted_hours numeric DEFAULT 0,
ADD COLUMN total_budget_amount numeric DEFAULT 0,
ADD COLUMN allocated_hours numeric DEFAULT 0,
ADD COLUMN remaining_hours numeric GENERATED ALWAYS AS (total_budgeted_hours - COALESCE(consumed_hours, 0) - COALESCE(allocated_hours, 0)) STORED,
ADD COLUMN budget_utilization_percentage numeric GENERATED ALWAYS AS (
  CASE 
    WHEN total_budget_amount > 0 
    THEN ((COALESCE(consumed_hours, 0) + COALESCE(allocated_hours, 0)) * 100.0 / total_budgeted_hours)
    ELSE 0 
  END
) STORED;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_project_stage_team_composition_updated_at
BEFORE UPDATE ON public.project_stage_team_composition
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to calculate and update stage budgets
CREATE OR REPLACE FUNCTION public.update_stage_budgets(p_project_id uuid, p_stage_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Update project_stages with calculated totals from team composition
  UPDATE public.project_stages 
  SET 
    total_budgeted_hours = (
      SELECT COALESCE(SUM(total_planned_hours), 0)
      FROM public.project_stage_team_composition 
      WHERE project_id = p_project_id AND stage_id = p_stage_id
    ),
    total_budget_amount = (
      SELECT COALESCE(SUM(total_budget_amount), 0)
      FROM public.project_stage_team_composition 
      WHERE project_id = p_project_id AND stage_id = p_stage_id
    ),
    allocated_hours = (
      SELECT COALESCE(SUM(hours), 0)
      FROM public.project_resource_allocations 
      WHERE project_id = p_project_id AND stage_id = p_stage_id
    )
  WHERE project_id = p_project_id AND stage_name = (
    SELECT name FROM public.office_stages WHERE id = p_stage_id
  );
END;
$function$;