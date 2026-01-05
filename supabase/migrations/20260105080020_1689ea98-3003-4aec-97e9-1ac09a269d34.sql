-- Phase 4: Fix remaining critical RLS issues

-- 1. Fix project_fees - we already restricted SELECT but there are INSERT/UPDATE policies that may still be permissive
DROP POLICY IF EXISTS "Users can insert project fees in their company" ON public.project_fees;
DROP POLICY IF EXISTS "Users can update project fees in their company" ON public.project_fees;
DROP POLICY IF EXISTS "Users can delete project fees in their company" ON public.project_fees;

CREATE POLICY "Admins can insert project fees" ON public.project_fees
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can update project fees" ON public.project_fees
  FOR UPDATE USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can delete project fees" ON public.project_fees
  FOR DELETE USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

-- 2. Fix invites table - restrict to admins only
DROP POLICY IF EXISTS "Users can view invites for their company" ON public.invites;
DROP POLICY IF EXISTS "Users can insert invites for their company" ON public.invites;
DROP POLICY IF EXISTS "Users can update invites for their company" ON public.invites;
DROP POLICY IF EXISTS "Company members can view invites" ON public.invites;

CREATE POLICY "Admins can view company invites" ON public.invites
  FOR SELECT USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can create invites" ON public.invites
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

CREATE POLICY "Admins can update invites" ON public.invites
  FOR UPDATE USING (company_id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

-- 3. Fix leave_requests - restrict to user's own, their manager, or admin
DROP POLICY IF EXISTS "Users can view leave requests in their company" ON public.leave_requests;

CREATE POLICY "Users can view own leave requests" ON public.leave_requests
  FOR SELECT USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      member_id = auth.uid() 
      OR requested_approver_id = auth.uid()
      OR approved_by = auth.uid()
      OR public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = leave_requests.member_id 
        AND profiles.manager_id = auth.uid()
      )
    )
  );

-- 4. Fix annual_leaves - restrict to user's own or admin
DROP POLICY IF EXISTS "Users can view annual leaves in their company" ON public.annual_leaves;

CREATE POLICY "Users can view own annual leaves" ON public.annual_leaves
  FOR SELECT USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      member_id = auth.uid() 
      OR public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = annual_leaves.member_id 
        AND profiles.manager_id = auth.uid()
      )
    )
  );

-- 5. Fix weekly_other_leave - restrict to user's own or admin
DROP POLICY IF EXISTS "Users can view weekly other leave in their company" ON public.weekly_other_leave;

CREATE POLICY "Users can view own weekly other leave" ON public.weekly_other_leave
  FOR SELECT USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      member_id = auth.uid() 
      OR public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = weekly_other_leave.member_id 
        AND profiles.manager_id = auth.uid()
      )
    )
  );

-- 6. Fix companies update policy - restrict to admins only
DROP POLICY IF EXISTS "Company members can update their own company" ON public.companies;

CREATE POLICY "Admins can update company settings" ON public.companies
  FOR UPDATE USING (id = public.get_user_company_id_safe() AND public.user_is_admin_safe());

-- 7. Fix project_resource_allocations - restrict to project managers and admins
DROP POLICY IF EXISTS "Users can view resource allocations in their company" ON public.project_resource_allocations;
DROP POLICY IF EXISTS "Users can insert resource allocations in their company" ON public.project_resource_allocations;
DROP POLICY IF EXISTS "Users can update resource allocations in their company" ON public.project_resource_allocations;
DROP POLICY IF EXISTS "Users can delete resource allocations in their company" ON public.project_resource_allocations;

CREATE POLICY "Admins and PMs can view resource allocations" ON public.project_resource_allocations
  FOR SELECT USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      resource_id = auth.uid()
      OR public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_resource_allocations.project_id 
        AND projects.project_manager_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and PMs can insert resource allocations" ON public.project_resource_allocations
  FOR INSERT WITH CHECK (
    company_id = public.get_user_company_id_safe() 
    AND (
      public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_resource_allocations.project_id 
        AND projects.project_manager_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and PMs can update resource allocations" ON public.project_resource_allocations
  FOR UPDATE USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_resource_allocations.project_id 
        AND projects.project_manager_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and PMs can delete resource allocations" ON public.project_resource_allocations
  FOR DELETE USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      public.user_is_admin_safe()
      OR EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_resource_allocations.project_id 
        AND projects.project_manager_id = auth.uid()
      )
    )
  );

-- 8. Fix projects table - restrict financial fields visibility  
DROP POLICY IF EXISTS "Users can view projects in their company" ON public.projects;
DROP POLICY IF EXISTS "Users can update projects in their company" ON public.projects;

-- Allow viewing basic project info but use a secure function for financial data
CREATE POLICY "Company members can view projects" ON public.projects
  FOR SELECT USING (company_id = public.get_user_company_id_safe());

CREATE POLICY "Admins and PMs can update projects" ON public.projects
  FOR UPDATE USING (
    company_id = public.get_user_company_id_safe() 
    AND (
      public.user_is_admin_safe()
      OR project_manager_id = auth.uid()
    )
  );

-- 9. Fix user_roles privilege escalation - prevent non-owners from granting owner role
DROP POLICY IF EXISTS "Admins can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user_roles" ON public.user_roles;

CREATE POLICY "Admins can manage user_roles except owner" ON public.user_roles
  FOR INSERT WITH CHECK (
    company_id = public.get_user_company_id_safe() 
    AND public.user_is_admin_safe()
    AND role != 'owner'
  );

CREATE POLICY "Admins can update user_roles except owner" ON public.user_roles
  FOR UPDATE USING (
    company_id = public.get_user_company_id_safe() 
    AND public.user_is_admin_safe()
    AND role != 'owner'
  );

CREATE POLICY "Admins can delete user_roles except owner" ON public.user_roles
  FOR DELETE USING (
    company_id = public.get_user_company_id_safe() 
    AND public.user_is_admin_safe()
    AND role != 'owner'
  );

-- Only owners can manage owner roles
CREATE POLICY "Owners can manage all roles" ON public.user_roles
  FOR ALL USING (
    company_id = public.get_user_company_id_safe() 
    AND public.user_has_owner_role(auth.uid())
  );

-- Create secure function to get projects without exposing financial data to regular users
CREATE OR REPLACE FUNCTION public.get_projects_secure(p_company_id uuid DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  name text,
  code text,
  status text,
  current_stage text,
  country text,
  department text,
  project_manager_id uuid,
  contract_start_date date,
  contract_end_date date,
  stages text[],
  -- Financial fields only for admins
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
SET search_path = 'public'
AS $$
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
$$;