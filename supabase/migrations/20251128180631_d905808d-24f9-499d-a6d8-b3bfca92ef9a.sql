-- Step 1: Rename column to reflect actual daily allocation dates
ALTER TABLE project_resource_allocations 
RENAME COLUMN week_start_date TO allocation_date;

-- Step 2: Create a view for weekly aggregations
-- This view automatically groups daily records by the Monday of each week
CREATE OR REPLACE VIEW weekly_resource_allocations AS
SELECT 
  project_id,
  resource_id,
  resource_type,
  company_id,
  stage_id,
  -- Calculate Monday of the week for each allocation_date
  (DATE_TRUNC('week', allocation_date::timestamp + INTERVAL '1 day')::date - INTERVAL '1 day')::date as week_start_date,
  -- Sum all hours for this resource/project/week combination
  SUM(hours) as hours,
  -- Aggregate financial data
  MAX(rate_snapshot) as rate_snapshot,
  SUM(allocation_amount) as allocation_amount,
  -- Track metadata
  MIN(created_at) as created_at,
  MAX(updated_at) as updated_at
FROM project_resource_allocations
GROUP BY 
  project_id, 
  resource_id, 
  resource_type, 
  company_id, 
  stage_id,
  DATE_TRUNC('week', allocation_date::timestamp + INTERVAL '1 day')
ORDER BY week_start_date DESC;

-- Step 3: Add comment to clarify usage
COMMENT ON VIEW weekly_resource_allocations IS 
'Aggregated weekly view of resource allocations. Use this for weekly planning UI. 
Query project_resource_allocations directly for daily breakdowns.';

COMMENT ON COLUMN project_resource_allocations.allocation_date IS 
'The actual date of allocation (can be any day). For weekly aggregates, use weekly_resource_allocations view.';