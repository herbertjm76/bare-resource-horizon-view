
-- Add new columns to projects table for financial tracking
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_hours numeric DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_amount numeric DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS blended_rate numeric DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contract_start_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS contract_end_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS financial_status text DEFAULT 'On Track';

-- Enhance project_stages table for better financial tracking
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS contracted_weeks numeric DEFAULT 0;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS budgeted_hours numeric DEFAULT 0;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS consumed_hours numeric DEFAULT 0;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS variance_percentage numeric DEFAULT 0;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS completion_percentage numeric DEFAULT 0;

-- Update project_fees table to support enhanced invoice workflow
ALTER TABLE public.project_fees ADD COLUMN IF NOT EXISTS invoice_number text;
ALTER TABLE public.project_fees ADD COLUMN IF NOT EXISTS payment_terms integer DEFAULT 30;
ALTER TABLE public.project_fees ADD COLUMN IF NOT EXISTS due_date date;
ALTER TABLE public.project_fees ADD COLUMN IF NOT EXISTS payment_date date;
ALTER TABLE public.project_fees ADD COLUMN IF NOT EXISTS notes text;

-- Create project_financial_tracking table for detailed financial monitoring
CREATE TABLE IF NOT EXISTS public.project_financial_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  stage_id uuid,
  week_ending date NOT NULL,
  hours_consumed numeric DEFAULT 0,
  cost_incurred numeric DEFAULT 0,
  revenue_recognized numeric DEFAULT 0,
  utilization_rate numeric DEFAULT 0,
  budget_variance numeric DEFAULT 0,
  company_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create staff_rates table for tracking individual staff rates
CREATE TABLE IF NOT EXISTS public.staff_rates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid NOT NULL,
  project_id uuid,
  stage_id uuid,
  rate_type text NOT NULL DEFAULT 'hourly',
  rate_value numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  effective_from date NOT NULL,
  effective_to date,
  is_active boolean DEFAULT true,
  company_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create project_budgets table for detailed budget tracking
CREATE TABLE IF NOT EXISTS public.project_budgets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  stage_id uuid,
  budget_type text NOT NULL,
  budgeted_amount numeric NOT NULL DEFAULT 0,
  spent_amount numeric DEFAULT 0,
  committed_amount numeric DEFAULT 0,
  forecast_amount numeric DEFAULT 0,
  variance_amount numeric DEFAULT 0,
  variance_percentage numeric DEFAULT 0,
  company_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add updated_at triggers for new tables
CREATE OR REPLACE TRIGGER handle_updated_at_project_financial_tracking
  BEFORE UPDATE ON public.project_financial_tracking
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_updated_at_staff_rates
  BEFORE UPDATE ON public.staff_rates
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_updated_at_project_budgets
  BEFORE UPDATE ON public.project_budgets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create function to calculate financial metrics
CREATE OR REPLACE FUNCTION public.calculate_project_financial_metrics(project_uuid uuid)
RETURNS TABLE(
  total_budget numeric,
  total_spent numeric,
  total_revenue numeric,
  profit_margin numeric,
  budget_variance numeric,
  schedule_variance numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.budget_amount, 0) as total_budget,
    COALESCE(SUM(pb.spent_amount), 0) as total_spent,
    COALESCE(SUM(pf.fee), 0) as total_revenue,
    CASE 
      WHEN COALESCE(SUM(pf.fee), 0) > 0 
      THEN ((COALESCE(SUM(pf.fee), 0) - COALESCE(SUM(pb.spent_amount), 0)) / COALESCE(SUM(pf.fee), 0)) * 100
      ELSE 0 
    END as profit_margin,
    (COALESCE(SUM(pb.spent_amount), 0) - COALESCE(p.budget_amount, 0)) as budget_variance,
    COALESCE(AVG(ps.variance_percentage), 0) as schedule_variance
  FROM public.projects p
  LEFT JOIN public.project_budgets pb ON p.id = pb.project_id
  LEFT JOIN public.project_fees pf ON p.id = pf.project_id
  LEFT JOIN public.project_stages ps ON p.id = ps.project_id
  WHERE p.id = project_uuid
  GROUP BY p.id, p.budget_amount;
END;
$$;
