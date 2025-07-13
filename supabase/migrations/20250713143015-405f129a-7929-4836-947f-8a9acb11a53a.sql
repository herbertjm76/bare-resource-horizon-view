-- Fix search_path security issues for database functions

-- Update handle_updated_at function to set proper search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update is_company_role function to set proper search_path  
CREATE OR REPLACE FUNCTION public.is_company_role(company_uuid uuid, requested_role user_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND company_id = company_uuid
      AND role = requested_role
  );
END;
$function$;

-- Update calculate_project_financial_metrics function to set proper search_path
CREATE OR REPLACE FUNCTION public.calculate_project_financial_metrics(project_uuid uuid)
RETURNS TABLE(total_budget numeric, total_spent numeric, total_revenue numeric, profit_margin numeric, budget_variance numeric, schedule_variance numeric, consumed_hours numeric, budget_hours numeric, blended_rate numeric, burn_rate numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;