-- =====================================================
-- COMPREHENSIVE SECURITY FIX - PART 2
-- Continue fixing remaining policies
-- =====================================================

-- =====================================================
-- PHASE 5: INVITES - Drop any remaining and recreate
-- =====================================================
DROP POLICY IF EXISTS "Admins can create invites" ON invites;
DROP POLICY IF EXISTS "Admins can update invites" ON invites;
DROP POLICY IF EXISTS "Admins can delete invites" ON invites;
DROP POLICY IF EXISTS "Admins can view invites" ON invites;

CREATE POLICY "Admins can view invites" ON invites
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can create invites" ON invites
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update invites" ON invites
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete invites" ON invites
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 6: LEAVE_REQUESTS - Fix to authenticated with role-based access
-- =====================================================
DROP POLICY IF EXISTS "Users can view own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can create leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can update own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can delete own leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Managers can view team leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can view all leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can manage all leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can view leave requests in their company" ON leave_requests;
DROP POLICY IF EXISTS "Users can update own pending leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Admins can update leave requests" ON leave_requests;
DROP POLICY IF EXISTS "Users can delete own pending leave requests" ON leave_requests;

CREATE POLICY "Users can view own leave requests" ON leave_requests
  FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Managers can view team leave requests" ON leave_requests
  FOR SELECT TO authenticated
  USING (
    company_id = get_user_company_id_safe() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = leave_requests.member_id 
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all leave requests" ON leave_requests
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can create leave requests" ON leave_requests
  FOR INSERT TO authenticated
  WITH CHECK (member_id = auth.uid() AND company_id = get_user_company_id_safe());

CREATE POLICY "Users can update own pending leave requests" ON leave_requests
  FOR UPDATE TO authenticated
  USING (member_id = auth.uid() AND status = 'pending')
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Admins can update leave requests" ON leave_requests
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can delete own pending leave requests" ON leave_requests
  FOR DELETE TO authenticated
  USING (member_id = auth.uid() AND status = 'pending');

-- =====================================================
-- PHASE 7: ANNUAL_LEAVES - Fix to authenticated with role-based access
-- =====================================================
DROP POLICY IF EXISTS "Users can view annual leaves in their company" ON annual_leaves;
DROP POLICY IF EXISTS "Users can insert annual leaves in their company" ON annual_leaves;
DROP POLICY IF EXISTS "Users can update annual leaves in their company" ON annual_leaves;
DROP POLICY IF EXISTS "Users can delete annual leaves in their company" ON annual_leaves;
DROP POLICY IF EXISTS "Users can view own annual leave" ON annual_leaves;
DROP POLICY IF EXISTS "Managers can view team annual leave" ON annual_leaves;
DROP POLICY IF EXISTS "Admins can view all annual leave" ON annual_leaves;
DROP POLICY IF EXISTS "Admins can insert annual leaves" ON annual_leaves;
DROP POLICY IF EXISTS "Admins can update annual leaves" ON annual_leaves;
DROP POLICY IF EXISTS "Admins can delete annual leaves" ON annual_leaves;

CREATE POLICY "Users can view own annual leave" ON annual_leaves
  FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Managers can view team annual leave" ON annual_leaves
  FOR SELECT TO authenticated
  USING (
    company_id = get_user_company_id_safe() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = annual_leaves.member_id 
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all annual leave" ON annual_leaves
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert annual leaves" ON annual_leaves
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update annual leaves" ON annual_leaves
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete annual leaves" ON annual_leaves
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 8: WEEKLY_OTHER_LEAVE - Fix to authenticated with role-based access
-- =====================================================
DROP POLICY IF EXISTS "Users can view weekly other leave in company" ON weekly_other_leave;
DROP POLICY IF EXISTS "Users can insert weekly other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Users can update weekly other leave in company" ON weekly_other_leave;
DROP POLICY IF EXISTS "Users can delete weekly other leave in company" ON weekly_other_leave;
DROP POLICY IF EXISTS "Users can view own other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Managers can view team other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Admins can view all other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Admins can insert other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Admins can update other leave" ON weekly_other_leave;
DROP POLICY IF EXISTS "Admins can delete other leave" ON weekly_other_leave;

CREATE POLICY "Users can view own other leave" ON weekly_other_leave
  FOR SELECT TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Managers can view team other leave" ON weekly_other_leave
  FOR SELECT TO authenticated
  USING (
    company_id = get_user_company_id_safe() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = weekly_other_leave.member_id 
      AND profiles.manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all other leave" ON weekly_other_leave
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert other leave" ON weekly_other_leave
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update other leave" ON weekly_other_leave
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete other leave" ON weekly_other_leave
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 9: PROJECT_FEES - Fix to authenticated admin-only
-- =====================================================
DROP POLICY IF EXISTS "Users can view project fees in their company" ON project_fees;
DROP POLICY IF EXISTS "Users can view project fees from their company" ON project_fees;
DROP POLICY IF EXISTS "Admins can view project fees" ON project_fees;
DROP POLICY IF EXISTS "Admins can insert project fees" ON project_fees;
DROP POLICY IF EXISTS "Admins can update project fees" ON project_fees;
DROP POLICY IF EXISTS "Admins can delete project fees" ON project_fees;

CREATE POLICY "Admins can view project fees" ON project_fees
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert project fees" ON project_fees
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update project fees" ON project_fees
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete project fees" ON project_fees
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 10: PROJECT_BUDGETS - Fix to authenticated admin-only
-- =====================================================
DROP POLICY IF EXISTS "Users can view project budgets in their company" ON project_budgets;
DROP POLICY IF EXISTS "Admins can view project budgets" ON project_budgets;
DROP POLICY IF EXISTS "Admins can insert project budgets" ON project_budgets;
DROP POLICY IF EXISTS "Admins can update project budgets" ON project_budgets;
DROP POLICY IF EXISTS "Admins can delete project budgets" ON project_budgets;

CREATE POLICY "Admins can view project budgets" ON project_budgets
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert project budgets" ON project_budgets
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update project budgets" ON project_budgets
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete project budgets" ON project_budgets
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 11: PROJECT_FINANCIAL_TRACKING - Fix to authenticated admin-only
-- =====================================================
DROP POLICY IF EXISTS "Users can view project financial tracking in their company" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can view project financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can insert project financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can update project financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can delete project financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can view financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can insert financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can update financial tracking" ON project_financial_tracking;
DROP POLICY IF EXISTS "Admins can delete financial tracking" ON project_financial_tracking;

CREATE POLICY "Admins can view financial tracking" ON project_financial_tracking
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert financial tracking" ON project_financial_tracking
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update financial tracking" ON project_financial_tracking
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete financial tracking" ON project_financial_tracking
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 12: STAFF_RATES - Fix to authenticated admin-only
-- =====================================================
DROP POLICY IF EXISTS "Users can view staff rates in their company" ON staff_rates;
DROP POLICY IF EXISTS "Admins can view staff rates" ON staff_rates;
DROP POLICY IF EXISTS "Admins can insert staff rates" ON staff_rates;
DROP POLICY IF EXISTS "Admins can update staff rates" ON staff_rates;
DROP POLICY IF EXISTS "Admins can delete staff rates" ON staff_rates;

CREATE POLICY "Admins can view staff rates" ON staff_rates
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can insert staff rates" ON staff_rates
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update staff rates" ON staff_rates
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete staff rates" ON staff_rates
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 13: PROJECTS - Fix to authenticated with proper access
-- =====================================================
DROP POLICY IF EXISTS "Users can view company projects" ON projects;
DROP POLICY IF EXISTS "Users can update company projects" ON projects;
DROP POLICY IF EXISTS "Users can delete company projects" ON projects;
DROP POLICY IF EXISTS "Users can insert company projects" ON projects;
DROP POLICY IF EXISTS "Admins can view company projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
DROP POLICY IF EXISTS "Project managers can view their projects" ON projects;

-- All authenticated company members can view projects (non-financial data)
CREATE POLICY "Users can view company projects" ON projects
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe());

-- Only admins can create/update/delete projects
CREATE POLICY "Admins can insert projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update projects" ON projects
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete projects" ON projects
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 14: PROJECT_RESOURCE_ALLOCATIONS - Fix to authenticated with role-based access
-- =====================================================
DROP POLICY IF EXISTS "Users can view resource allocations in their company" ON project_resource_allocations;
DROP POLICY IF EXISTS "Users can insert resource allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Users can update resource allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Users can delete resource allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Users can view own allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "PMs can view project allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Admins can view all allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Admins can manage allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Admins can insert allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Admins can update allocations" ON project_resource_allocations;
DROP POLICY IF EXISTS "Admins can delete allocations" ON project_resource_allocations;

-- Users can view their own allocations
CREATE POLICY "Users can view own allocations" ON project_resource_allocations
  FOR SELECT TO authenticated
  USING (resource_id = auth.uid());

-- Project managers can view allocations for their projects
CREATE POLICY "PMs can view project allocations" ON project_resource_allocations
  FOR SELECT TO authenticated
  USING (
    company_id = get_user_company_id_safe() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_resource_allocations.project_id 
      AND projects.project_manager_id = auth.uid()
    )
  );

-- Admins can view all allocations
CREATE POLICY "Admins can view all allocations" ON project_resource_allocations
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- Only admins can manage allocations
CREATE POLICY "Admins can insert allocations" ON project_resource_allocations
  FOR INSERT TO authenticated
  WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can update allocations" ON project_resource_allocations
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Admins can delete allocations" ON project_resource_allocations
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- =====================================================
-- PHASE 15: USER_ROLES - Secure role management
-- =====================================================
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view company roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Owners can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete non-owner roles" ON user_roles;
DROP POLICY IF EXISTS "Owners can manage owner roles" ON user_roles;

CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view company roles" ON user_roles
  FOR SELECT TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe());

-- Admins can manage non-owner roles (prevent privilege escalation)
CREATE POLICY "Admins can insert non-owner roles" ON user_roles
  FOR INSERT TO authenticated
  WITH CHECK (
    company_id = get_user_company_id_safe() AND 
    user_is_admin_safe() AND 
    role != 'owner'
  );

CREATE POLICY "Admins can update non-owner roles" ON user_roles
  FOR UPDATE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe() AND role != 'owner')
  WITH CHECK (role != 'owner');

CREATE POLICY "Admins can delete non-owner roles" ON user_roles
  FOR DELETE TO authenticated
  USING (company_id = get_user_company_id_safe() AND user_is_admin_safe() AND role != 'owner');

-- Only owners can manage owner roles
CREATE POLICY "Owners can manage owner roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    company_id = get_user_company_id_safe() AND 
    user_has_owner_role(auth.uid())
  )
  WITH CHECK (
    company_id = get_user_company_id_safe() AND 
    user_has_owner_role(auth.uid())
  );