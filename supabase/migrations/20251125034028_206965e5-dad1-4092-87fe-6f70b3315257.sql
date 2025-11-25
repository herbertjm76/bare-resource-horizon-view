-- Rename office_sectors table to office_practice_areas
ALTER TABLE public.office_sectors RENAME TO office_practice_areas;

-- Drop old RLS policies
DROP POLICY IF EXISTS "Admins can manage sectors in their company" ON public.office_practice_areas;
DROP POLICY IF EXISTS "Users can view sectors in their company" ON public.office_practice_areas;

-- Create new RLS policies with updated names
CREATE POLICY "Admins can manage practice areas in their company" 
ON public.office_practice_areas
FOR ALL
USING (company_id = get_user_company_id_safe() AND user_is_admin_safe())
WITH CHECK (company_id = get_user_company_id_safe() AND user_is_admin_safe());

CREATE POLICY "Users can view practice areas in their company" 
ON public.office_practice_areas
FOR SELECT
USING (company_id = get_user_company_id_safe());