-- Phase 1: Database Enforcement for Allocation Week Keys

-- Step 1: Ensure the normalization function exists and is correct
CREATE OR REPLACE FUNCTION public.normalize_allocation_date_to_company_week_start()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  company_week_start TEXT;
  target_dow INT;
  current_dow INT;
  diff INT;
BEGIN
  -- Skip if company_id is null (cannot normalize without company)
  IF NEW.company_id IS NULL THEN
    RAISE WARNING 'Allocation insert/update without company_id - cannot normalize week start';
    RETURN NEW;
  END IF;

  -- Get the company's week start preference
  SELECT COALESCE(start_of_work_week, 'Monday') INTO company_week_start
  FROM companies WHERE id = NEW.company_id;
  
  -- Default to Monday if company not found
  IF company_week_start IS NULL THEN
    company_week_start := 'Monday';
  END IF;
  
  -- Determine target day of week (0=Sun, 1=Mon, 6=Sat)
  target_dow := CASE company_week_start
    WHEN 'Sunday' THEN 0
    WHEN 'Saturday' THEN 6
    ELSE 1  -- Monday default
  END;
  
  -- Get current day of week from allocation_date
  current_dow := EXTRACT(DOW FROM NEW.allocation_date)::INT;
  
  -- Calculate adjustment to week start
  diff := current_dow - target_dow;
  IF diff < 0 THEN 
    diff := diff + 7; 
  END IF;
  
  -- Normalize to week start
  NEW.allocation_date := NEW.allocation_date - (diff || ' days')::INTERVAL;
  
  RETURN NEW;
END;
$function$;

-- Step 2: Create the trigger on project_resource_allocations
DROP TRIGGER IF EXISTS trg_normalize_allocation_date ON public.project_resource_allocations;

CREATE TRIGGER trg_normalize_allocation_date
  BEFORE INSERT OR UPDATE ON public.project_resource_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_allocation_date_to_company_week_start();

-- Step 3: Backfill company_id where null (derive from project -> company)
UPDATE public.project_resource_allocations pra
SET company_id = p.company_id
FROM public.projects p
WHERE pra.project_id = p.id
  AND pra.company_id IS NULL
  AND p.company_id IS NOT NULL;

-- Step 4: Backfill/normalize existing allocation_date values
-- This updates all rows, triggering the normalization function
-- We do a dummy update that forces the trigger to fire
UPDATE public.project_resource_allocations
SET allocation_date = allocation_date
WHERE company_id IS NOT NULL;

-- Step 5: Add a validation check function to warn on invalid week starts (dev safety)
CREATE OR REPLACE FUNCTION public.validate_allocation_week_start()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  company_week_start TEXT;
  expected_dow INT;
  actual_dow INT;
BEGIN
  IF NEW.company_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(start_of_work_week, 'Monday') INTO company_week_start
  FROM companies WHERE id = NEW.company_id;
  
  expected_dow := CASE company_week_start
    WHEN 'Sunday' THEN 0
    WHEN 'Saturday' THEN 6
    ELSE 1
  END;
  
  actual_dow := EXTRACT(DOW FROM NEW.allocation_date)::INT;
  
  IF actual_dow != expected_dow THEN
    RAISE WARNING 'Allocation date % is not on expected week start day (expected dow=%, got dow=%) for company %',
      NEW.allocation_date, expected_dow, actual_dow, NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Step 6: Create validation trigger (runs AFTER normalization trigger)
DROP TRIGGER IF EXISTS trg_validate_allocation_week_start ON public.project_resource_allocations;

CREATE TRIGGER trg_validate_allocation_week_start
  AFTER INSERT OR UPDATE ON public.project_resource_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_allocation_week_start();