
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.calculate_project_financial_metrics(uuid);

-- Add consumed_hours tracking to projects table for overall project consumption
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS consumed_hours numeric DEFAULT 0;

-- Create the updated financial metrics function with new return columns
CREATE OR REPLACE FUNCTION public.calculate_project_financial_metrics(project_uuid uuid)
RETURNS TABLE(
  total_budget numeric,
  total_spent numeric,
  total_revenue numeric,
  profit_margin numeric,
  budget_variance numeric,
  schedule_variance numeric,
  consumed_hours numeric,
  budget_hours numeric,
  blended_rate numeric,
  burn_rate numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(pf.fee), 0) as total_budget, -- Budget from stage fees
    COALESCE(SUM(pb.spent_amount), 0) as total_spent,
    COALESCE(SUM(pf.fee), 0) as total_revenue,
    CASE 
      WHEN COALESCE(SUM(pf.fee), 0) > 0 
      THEN ((COALESCE(SUM(pf.fee), 0) - COALESCE(SUM(pb.spent_amount), 0)) / COALESCE(SUM(pf.fee), 0)) * 100
      ELSE 0 
    END as profit_margin,
    (COALESCE(SUM(pb.spent_amount), 0) - COALESCE(SUM(pf.fee), 0)) as budget_variance,
    COALESCE(AVG(ps.variance_percentage), 0) as schedule_variance,
    COALESCE(p.consumed_hours, 0) as consumed_hours,
    CASE 
      WHEN COALESCE(p.average_rate, 0) > 0 
      THEN COALESCE(SUM(pf.fee), 0) / p.average_rate
      ELSE 0 
    END as budget_hours,
    COALESCE(p.average_rate, 0) as blended_rate,
    CASE 
      WHEN EXTRACT(EPOCH FROM (now() - p.contract_start_date)) / (24 * 3600) > 0
      THEN COALESCE(p.consumed_hours, 0) / (EXTRACT(EPOCH FROM (now() - p.contract_start_date)) / (24 * 3600))
      ELSE 0 
    END as burn_rate
  FROM public.projects p
  LEFT JOIN public.project_budgets pb ON p.id = pb.project_id
  LEFT JOIN public.project_fees pf ON p.id = pf.project_id
  LEFT JOIN public.project_stages ps ON p.id = ps.project_id
  WHERE p.id = project_uuid
  GROUP BY p.id, p.consumed_hours, p.average_rate, p.contract_start_date;
END;
$$;
