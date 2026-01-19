DROP FUNCTION IF EXISTS public.get_projects_secure(uuid);

CREATE FUNCTION public.get_projects_secure(p_company_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(
   id uuid,
   name text,
   code text,
   abbreviation text,
   status text,
   current_stage text,
   country text,
   department text,
   project_manager_id uuid,
   contract_start_date date,
   contract_end_date date,
   stages text[],
   budget_amount numeric,
   budget_hours numeric,
   consumed_hours numeric,
   average_rate numeric,
   blended_rate numeric,
   financial_status text,
   target_profit_percentage numeric
 )
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_company_id uuid;
  v_is_admin boolean;
BEGIN
  v_company_id := COALESCE(p_company_id, public.get_user_company_id_safe());
  v_is_admin := public.user_is_admin_safe();
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name::text,
    p.code::text,
    p.abbreviation::text,
    p.status::text,
    p.current_stage::text,
    p.country::text,
    p.department::text,
    p.project_manager_id,
    p.contract_start_date::date,
    p.contract_end_date::date,
    p.stages,
    -- Financial fields masked for non-admins
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.budget_amount ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.budget_hours ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.consumed_hours ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.average_rate ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.blended_rate ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.financial_status ELSE NULL END,
    CASE WHEN v_is_admin OR p.project_manager_id = auth.uid() THEN p.target_profit_percentage ELSE NULL END
  FROM public.projects p
  WHERE p.company_id = v_company_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_projects_secure(uuid) TO PUBLIC;