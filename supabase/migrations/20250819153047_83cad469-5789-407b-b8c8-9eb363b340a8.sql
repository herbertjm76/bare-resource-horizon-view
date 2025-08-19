-- Remove the dangerous public read access policy from projects table
-- This policy was allowing anyone on the internet to read sensitive business data
-- including project names, financial data, budget amounts, profit percentages, 
-- client locations, and internal project codes
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;

-- Verify that proper company-scoped policies remain in place:
-- 1. "Admins can manage projects in their company" - ✓ (restricts to company admins)
-- 2. "Users can view projects in their company" - ✓ (restricts to company members)
-- 3. "Users can view company projects" - ✓ (restricts to company members)
-- 4. "Users can create company projects" - ✓ (restricts to company members)
-- 5. "Users can update company projects" - ✓ (restricts to company members)
-- 6. "Users can delete company projects" - ✓ (restricts to company members)

-- These existing policies ensure that only authenticated users from the same company
-- can access projects data, which is the correct security model for business data.