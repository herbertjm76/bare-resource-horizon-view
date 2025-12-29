-- Update seed_default_leave_types to check for existing leave types before inserting
CREATE OR REPLACE FUNCTION public.seed_default_leave_types(p_company_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only seed if no leave types exist for this company
  IF NOT EXISTS (SELECT 1 FROM leave_types WHERE company_id = p_company_id) THEN
    INSERT INTO leave_types (company_id, name, code, requires_attachment, color, icon, order_index)
    VALUES 
      (p_company_id, 'Vacation / PTO', 'vacation', false, '#22C55E', 'palmtree', 1),
      (p_company_id, 'Sick Leave', 'sick', true, '#EF4444', 'thermometer', 2),
      (p_company_id, 'Maternity Leave', 'maternity', false, '#EC4899', 'baby', 3),
      (p_company_id, 'Paternity Leave', 'paternity', false, '#8B5CF6', 'baby', 4),
      (p_company_id, 'Compassionate Leave', 'compassionate', false, '#6B7280', 'heart', 5),
      (p_company_id, 'Training / Professional Development', 'training', false, '#3B82F6', 'graduation-cap', 6),
      (p_company_id, 'Other', 'other', false, '#F59E0B', 'file-text', 7)
    ON CONFLICT (company_id, name) DO NOTHING;
  END IF;
END;
$function$;