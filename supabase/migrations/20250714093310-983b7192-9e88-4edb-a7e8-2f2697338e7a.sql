-- Create realistic project allocations for Paul Julius to show different utilization patterns
-- We'll create allocations for different weeks to show various scenarios

-- Current week - well utilized (38 hours)
WITH current_week AS (
  SELECT date_trunc('week', CURRENT_DATE)::date as week_start
)
INSERT INTO public.project_resource_allocations (
  project_id,
  resource_id,
  resource_type,
  week_start_date,
  hours,
  company_id
)
SELECT 
  p.id as project_id,
  'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' as resource_id,
  'active' as resource_type,
  cw.week_start as week_start_date,
  CASE 
    WHEN p.code = 'XYZ' THEN 20
    WHEN p.code = 'ABC' THEN 18
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM current_week cw
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p;

-- Next week - overworked (48 hours)
WITH next_week AS (
  SELECT (date_trunc('week', CURRENT_DATE) + interval '1 week')::date as week_start
)
INSERT INTO public.project_resource_allocations (
  project_id,
  resource_id,
  resource_type,
  week_start_date,
  hours,
  company_id
)
SELECT 
  p.id as project_id,
  'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' as resource_id,
  'active' as resource_type,
  nw.week_start as week_start_date,
  CASE 
    WHEN p.code = 'XYZ' THEN 28
    WHEN p.code = 'ABC' THEN 20
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM next_week nw
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p;

-- Previous week - underutilized (25 hours)
WITH prev_week AS (
  SELECT (date_trunc('week', CURRENT_DATE) - interval '1 week')::date as week_start
)
INSERT INTO public.project_resource_allocations (
  project_id,
  resource_id,
  resource_type,
  week_start_date,
  hours,
  company_id
)
SELECT 
  p.id as project_id,
  'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' as resource_id,
  'active' as resource_type,
  pw.week_start as week_start_date,
  CASE 
    WHEN p.code = 'XYZ' THEN 15
    WHEN p.code = 'ABC' THEN 10
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM prev_week pw
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p;