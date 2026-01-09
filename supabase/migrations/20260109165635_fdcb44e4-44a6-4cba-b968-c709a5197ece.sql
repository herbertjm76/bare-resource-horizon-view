-- Create function to normalize allocation_date to company's week start preference
CREATE OR REPLACE FUNCTION normalize_allocation_date_to_company_week_start()
RETURNS TRIGGER AS $$
DECLARE
  company_week_start TEXT;
  target_dow INT;
  current_dow INT;
  diff INT;
BEGIN
  -- Get the company's week start preference
  SELECT COALESCE(start_of_work_week, 'Monday') INTO company_week_start
  FROM companies WHERE id = NEW.company_id;
  
  -- Default to Monday if not found
  IF company_week_start IS NULL THEN
    company_week_start := 'Monday';
  END IF;
  
  -- Determine target day of week (0=Sun, 1=Mon, 6=Sat)
  target_dow := CASE company_week_start
    WHEN 'Sunday' THEN 0
    WHEN 'Saturday' THEN 6
    ELSE 1  -- Monday default
  END;
  
  -- Get current day of week
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger that runs BEFORE INSERT or UPDATE
DROP TRIGGER IF EXISTS enforce_company_week_start ON project_resource_allocations;

CREATE TRIGGER enforce_company_week_start
  BEFORE INSERT OR UPDATE ON project_resource_allocations
  FOR EACH ROW
  EXECUTE FUNCTION normalize_allocation_date_to_company_week_start();

-- Add a comment explaining the constraint
COMMENT ON TRIGGER enforce_company_week_start ON project_resource_allocations IS 
  'Automatically normalizes allocation_date to the company week start day (Monday/Sunday/Saturday). This is critical for consistent utilization calculations across the app.';

-- Migrate existing data to be normalized based on each company's week start preference
UPDATE project_resource_allocations pra
SET allocation_date = (
  SELECT 
    CASE COALESCE(c.start_of_work_week, 'Monday')
      WHEN 'Sunday' THEN 
        pra.allocation_date - (EXTRACT(DOW FROM pra.allocation_date)::INT || ' days')::INTERVAL
      WHEN 'Saturday' THEN
        pra.allocation_date - ((EXTRACT(DOW FROM pra.allocation_date)::INT + 1) % 7 || ' days')::INTERVAL
      ELSE -- Monday (default)
        pra.allocation_date - ((EXTRACT(DOW FROM pra.allocation_date)::INT + 6) % 7 || ' days')::INTERVAL
    END
  FROM companies c WHERE c.id = pra.company_id
)
WHERE EXISTS (SELECT 1 FROM companies c WHERE c.id = pra.company_id);