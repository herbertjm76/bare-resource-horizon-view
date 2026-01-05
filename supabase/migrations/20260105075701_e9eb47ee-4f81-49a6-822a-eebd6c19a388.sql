-- Phase 1: Restrict Financial Data Access
-- Drop overly permissive SELECT policies on financial tables

DROP POLICY IF EXISTS "Users can view project budgets in their company" ON public.project_budgets;
DROP POLICY IF EXISTS "Users can view project fees in their company" ON public.project_fees;
DROP POLICY IF EXISTS "Users can view project fees from their company" ON public.project_fees;
DROP POLICY IF EXISTS "Users can view project financial tracking in their company" ON public.project_financial_tracking;
DROP POLICY IF EXISTS "Users can view staff rates in their company" ON public.staff_rates;

-- Create admin-only SELECT policies for financial tables
CREATE POLICY "Admins can view project budgets" ON public.project_budgets
  FOR SELECT USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can view project fees" ON public.project_fees
  FOR SELECT USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can view project financial tracking" ON public.project_financial_tracking
  FOR SELECT USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can view staff rates" ON public.staff_rates
  FOR SELECT USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

-- Phase 2: Fix SECURITY DEFINER search_path issue
CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Create secure financial data access function
CREATE OR REPLACE FUNCTION public.get_financial_data_secure(
  p_company_id uuid,
  p_data_type text,
  p_project_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_is_admin boolean;
  v_result jsonb;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN '{"error": "Not authenticated", "data": []}'::jsonb;
  END IF;
  
  SELECT public.user_is_admin_safe() INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN '{"error": "Access denied", "data": []}'::jsonb;
  END IF;
  
  CASE p_data_type
    WHEN 'budgets' THEN
      SELECT COALESCE(jsonb_agg(row_to_json(pb.*)), '[]'::jsonb) INTO v_result
      FROM public.project_budgets pb
      WHERE pb.company_id = p_company_id
        AND (p_project_id IS NULL OR pb.project_id = p_project_id);
    WHEN 'fees' THEN
      SELECT COALESCE(jsonb_agg(row_to_json(pf.*)), '[]'::jsonb) INTO v_result
      FROM public.project_fees pf
      WHERE pf.company_id = p_company_id
        AND (p_project_id IS NULL OR pf.project_id = p_project_id);
    WHEN 'tracking' THEN
      SELECT COALESCE(jsonb_agg(row_to_json(pft.*)), '[]'::jsonb) INTO v_result
      FROM public.project_financial_tracking pft
      WHERE pft.company_id = p_company_id
        AND (p_project_id IS NULL OR pft.project_id = p_project_id);
    WHEN 'rates' THEN
      SELECT COALESCE(jsonb_agg(row_to_json(sr.*)), '[]'::jsonb) INTO v_result
      FROM public.staff_rates sr
      WHERE sr.company_id = p_company_id;
    ELSE
      RETURN '{"error": "Invalid data type"}'::jsonb;
  END CASE;
  
  RETURN v_result;
END;
$$;