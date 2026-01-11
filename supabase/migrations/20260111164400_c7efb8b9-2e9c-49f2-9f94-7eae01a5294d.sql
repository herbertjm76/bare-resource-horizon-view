-- Phase 2: Add database triggers and unique constraint for allocation rule book enforcement

-- Step 1: Create the normalization trigger if it doesn't exist
DROP TRIGGER IF EXISTS trg_normalize_allocation_date ON public.project_resource_allocations;

CREATE TRIGGER trg_normalize_allocation_date
  BEFORE INSERT OR UPDATE ON public.project_resource_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_allocation_date_to_company_week_start();

-- Step 2: Create validation trigger (warning only, doesn't block)
DROP TRIGGER IF EXISTS trg_validate_allocation_week_start ON public.project_resource_allocations;

CREATE TRIGGER trg_validate_allocation_week_start
  BEFORE INSERT OR UPDATE ON public.project_resource_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_allocation_week_start();

-- Step 3: Add unique constraint to prevent duplicates
-- First, we need to clean up any existing duplicates before adding the constraint
-- This is a safety check - the edge function should run first, but this handles edge cases

-- Create a temporary function to clean duplicates before adding constraint
CREATE OR REPLACE FUNCTION public.cleanup_allocation_duplicates_for_constraint()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  dup_record RECORD;
  ids_to_delete uuid[];
BEGIN
  -- Find and delete duplicates, keeping the most recently updated row
  FOR dup_record IN
    SELECT 
      company_id, 
      project_id, 
      resource_id, 
      allocation_date,
      array_agg(id ORDER BY updated_at DESC) as all_ids
    FROM project_resource_allocations
    GROUP BY company_id, project_id, resource_id, allocation_date
    HAVING count(*) > 1
  LOOP
    -- Keep the first (most recent), delete the rest
    ids_to_delete := dup_record.all_ids[2:array_length(dup_record.all_ids, 1)];
    
    IF array_length(ids_to_delete, 1) > 0 THEN
      DELETE FROM project_resource_allocations WHERE id = ANY(ids_to_delete);
      RAISE NOTICE 'Deleted % duplicate rows for allocation_date %', 
        array_length(ids_to_delete, 1), dup_record.allocation_date;
    END IF;
  END LOOP;
END;
$$;

-- Run the cleanup
SELECT public.cleanup_allocation_duplicates_for_constraint();

-- Drop the temporary function
DROP FUNCTION IF EXISTS public.cleanup_allocation_duplicates_for_constraint();

-- Now add the unique constraint
-- Drop if exists first (in case of re-run)
ALTER TABLE public.project_resource_allocations 
  DROP CONSTRAINT IF EXISTS unique_allocation_per_resource_week;

ALTER TABLE public.project_resource_allocations 
  ADD CONSTRAINT unique_allocation_per_resource_week 
  UNIQUE (company_id, project_id, resource_id, allocation_date);

-- Add a comment explaining the constraint
COMMENT ON CONSTRAINT unique_allocation_per_resource_week ON public.project_resource_allocations IS 
  'Rule Book: Each resource can only have ONE allocation per project per week. The allocation_date is always normalized to the company week start day by the normalization trigger.';
