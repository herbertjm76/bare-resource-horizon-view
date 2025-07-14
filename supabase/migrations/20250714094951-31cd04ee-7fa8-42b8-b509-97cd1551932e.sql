-- Create realistic project allocations for pre-registered members to show different utilization patterns
-- Get pre-registered member IDs and create allocations for different weeks

-- Current week allocations for pre-registered members
WITH current_week AS (
  SELECT date_trunc('week', CURRENT_DATE)::date as week_start
),
pre_registered_members AS (
  SELECT i.id, ROW_NUMBER() OVER (ORDER BY i.created_at) as rn
  FROM invites i 
  WHERE i.company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND i.invitation_type = 'pre_registered'
  AND i.status = 'pending'
  LIMIT 3
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
  prm.id as resource_id,
  'pre_registered' as resource_type,
  cw.week_start as week_start_date,
  CASE 
    -- Member 1: Well utilized (36 hours)
    WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 20
    WHEN prm.rn = 1 AND p.code = 'ABC' THEN 16
    -- Member 2: Overworked (45 hours)
    WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 25
    WHEN prm.rn = 2 AND p.code = 'ABC' THEN 20
    -- Member 3: Underutilized (28 hours)
    WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 18
    WHEN prm.rn = 3 AND p.code = 'ABC' THEN 10
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM current_week cw
CROSS JOIN pre_registered_members prm
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p
WHERE CASE 
  WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 20
  WHEN prm.rn = 1 AND p.code = 'ABC' THEN 16
  WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 25
  WHEN prm.rn = 2 AND p.code = 'ABC' THEN 20
  WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 18
  WHEN prm.rn = 3 AND p.code = 'ABC' THEN 10
  ELSE 0
END > 0;

-- Next week allocations for pre-registered members
WITH next_week AS (
  SELECT (date_trunc('week', CURRENT_DATE) + interval '1 week')::date as week_start
),
pre_registered_members AS (
  SELECT i.id, ROW_NUMBER() OVER (ORDER BY i.created_at) as rn
  FROM invites i 
  WHERE i.company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND i.invitation_type = 'pre_registered'
  AND i.status = 'pending'
  LIMIT 3
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
  prm.id as resource_id,
  'pre_registered' as resource_type,
  nw.week_start as week_start_date,
  CASE 
    -- Member 1: Overworked next week (42 hours)
    WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 22
    WHEN prm.rn = 1 AND p.code = 'ABC' THEN 20
    -- Member 2: Well utilized (38 hours)
    WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 20
    WHEN prm.rn = 2 AND p.code = 'ABC' THEN 18
    -- Member 3: Still underutilized (30 hours)
    WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 15
    WHEN prm.rn = 3 AND p.code = 'ABC' THEN 15
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM next_week nw
CROSS JOIN pre_registered_members prm
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p
WHERE CASE 
  WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 22
  WHEN prm.rn = 1 AND p.code = 'ABC' THEN 20
  WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 20
  WHEN prm.rn = 2 AND p.code = 'ABC' THEN 18
  WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 15
  WHEN prm.rn = 3 AND p.code = 'ABC' THEN 15
  ELSE 0
END > 0;

-- Previous week allocations for pre-registered members
WITH prev_week AS (
  SELECT (date_trunc('week', CURRENT_DATE) - interval '1 week')::date as week_start
),
pre_registered_members AS (
  SELECT i.id, ROW_NUMBER() OVER (ORDER BY i.created_at) as rn
  FROM invites i 
  WHERE i.company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND i.invitation_type = 'pre_registered'
  AND i.status = 'pending'
  LIMIT 3
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
  prm.id as resource_id,
  'pre_registered' as resource_type,
  pw.week_start as week_start_date,
  CASE 
    -- Member 1: Underutilized last week (24 hours)
    WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 14
    WHEN prm.rn = 1 AND p.code = 'ABC' THEN 10
    -- Member 2: Overworked last week (46 hours)
    WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 26
    WHEN prm.rn = 2 AND p.code = 'ABC' THEN 20
    -- Member 3: Well utilized (37 hours)
    WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 20
    WHEN prm.rn = 3 AND p.code = 'ABC' THEN 17
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM prev_week pw
CROSS JOIN pre_registered_members prm
CROSS JOIN (
  SELECT id, code FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c' 
  AND code IN ('XYZ', 'ABC')
) p
WHERE CASE 
  WHEN prm.rn = 1 AND p.code = 'XYZ' THEN 14
  WHEN prm.rn = 1 AND p.code = 'ABC' THEN 10
  WHEN prm.rn = 2 AND p.code = 'XYZ' THEN 26
  WHEN prm.rn = 2 AND p.code = 'ABC' THEN 20
  WHEN prm.rn = 3 AND p.code = 'XYZ' THEN 20
  WHEN prm.rn = 3 AND p.code = 'ABC' THEN 17
  ELSE 0
END > 0;