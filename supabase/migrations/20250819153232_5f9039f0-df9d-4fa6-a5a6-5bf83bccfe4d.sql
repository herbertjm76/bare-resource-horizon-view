-- Remove the dangerous public read access policy from project_stages table
-- This policy was allowing anyone on the internet to read sensitive financial data
-- including project fees, billing amounts, invoice dates, company IDs, and other
-- confidential business information that competitors could use against the business
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_stages;

-- Verify that proper company-scoped policies remain in place:
-- 1. "Admins can manage project stages in their company" - ✓ (restricts to company admins)
-- 2. "Users can view project stages in their company" - ✓ (restricts to company members)
-- 3. "Users can view their company's project stages" - ✓ (restricts to company members)
-- 4. "Users can create project stages for their company's projects" - ✓ (restricts to company members)
-- 5. "Users can update project stages for their company's projects" - ✓ (restricts to company members)
-- 6. "Users can delete project stages for their company's projects" - ✓ (restricts to company members)

-- These existing policies ensure that only authenticated users from the same company
-- can access project stages data, protecting sensitive financial information.