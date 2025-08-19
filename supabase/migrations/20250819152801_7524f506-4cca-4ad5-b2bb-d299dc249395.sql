-- Remove the dangerous public read access policy from project_resources table
-- This policy was allowing anyone on the internet to read sensitive business data
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_resources;

-- Verify that proper company-scoped policies remain in place:
-- 1. "Admins can manage project resources in their company" - ✓ (restricts to company admins)
-- 2. "Allow users to view project resources for their company" - ✓ (restricts to company members)
-- 3. "Users can view project resources in their company" - ✓ (restricts to company members)

-- These existing policies ensure that only authenticated users from the same company
-- can access project resources data, which is the correct security model.