-- First, let's add more team members to create a realistic team
INSERT INTO public.profiles (
  id,
  company_id,
  email,
  first_name,
  last_name,
  role,
  job_title,
  department,
  weekly_capacity
) VALUES 
-- Well-utilized team members (around 100%)
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'sarah.johnson@company.com', 'Sarah', 'Johnson', 'member', 'Senior Architect', 'Design', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'mike.davis@company.com', 'Mike', 'Davis', 'member', 'Project Manager', 'Management', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'emma.wilson@company.com', 'Emma', 'Wilson', 'member', 'Civil Engineer', 'Engineering', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'david.brown@company.com', 'David', 'Brown', 'member', 'Construction Manager', 'Construction', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'lisa.taylor@company.com', 'Lisa', 'Taylor', 'member', 'Interior Designer', 'Design', 40),
-- Overworked team members (>100%)
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'james.martinez@company.com', 'James', 'Martinez', 'member', 'Lead Engineer', 'Engineering', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'anna.garcia@company.com', 'Anna', 'Garcia', 'member', 'Senior Designer', 'Design', 40),
-- Underutilized team members (<100%)
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'robert.lee@company.com', 'Robert', 'Lee', 'member', 'Junior Architect', 'Design', 40),
(gen_random_uuid(), '4719112e-bac8-45b6-b001-e14a78e9583c', 'jennifer.white@company.com', 'Jennifer', 'White', 'member', 'Trainee Engineer', 'Engineering', 40);

-- Now let's create realistic project allocations for the current week
-- Get Monday of current week for consistency
WITH current_week AS (
  SELECT date_trunc('week', CURRENT_DATE)::date as week_start
),
team_members AS (
  SELECT id, first_name, last_name, weekly_capacity 
  FROM profiles 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c'
),
projects AS (
  SELECT id, code 
  FROM projects 
  WHERE company_id = '4719112e-bac8-45b6-b001-e14a78e9583c'
  LIMIT 8
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
  tm.id as resource_id,
  'active' as resource_type,
  cw.week_start as week_start_date,
  CASE 
    -- Paul Julius (existing member) - well utilized (38 hours)
    WHEN tm.first_name = 'Paul' AND p.code = 'XYZ' THEN 20
    WHEN tm.first_name = 'Paul' AND p.code = 'ABC' THEN 18
    
    -- Sarah Johnson - well utilized (40 hours)
    WHEN tm.first_name = 'Sarah' AND p.code = 'HERB' THEN 25
    WHEN tm.first_name = 'Sarah' AND p.code = 'XYX' THEN 15
    
    -- Mike Davis - well utilized (39 hours)
    WHEN tm.first_name = 'Mike' AND p.code = 'HXFX' THEN 22
    WHEN tm.first_name = 'Mike' AND p.code = 'KJS' THEN 17
    
    -- Emma Wilson - well utilized (40 hours)
    WHEN tm.first_name = 'Emma' AND p.code = 'GMWH' THEN 24
    WHEN tm.first_name = 'Emma' AND p.code = 'TXE' THEN 16
    
    -- David Brown - well utilized (37 hours)
    WHEN tm.first_name = 'David' AND p.code = 'OOT' THEN 20
    WHEN tm.first_name = 'David' AND p.code = 'RHH' THEN 17
    
    -- Lisa Taylor - well utilized (38 hours)
    WHEN tm.first_name = 'Lisa' AND p.code = 'XYZ' THEN 23
    WHEN tm.first_name = 'Lisa' AND p.code = 'ABC' THEN 15
    
    -- James Martinez - OVERWORKED (48 hours)
    WHEN tm.first_name = 'James' AND p.code = 'HERB' THEN 28
    WHEN tm.first_name = 'James' AND p.code = 'XYX' THEN 20
    
    -- Anna Garcia - OVERWORKED (46 hours)
    WHEN tm.first_name = 'Anna' AND p.code = 'HXFX' THEN 26
    WHEN tm.first_name = 'Anna' AND p.code = 'KJS' THEN 20
    
    -- Robert Lee - UNDERUTILIZED (25 hours)
    WHEN tm.first_name = 'Robert' AND p.code = 'GMWH' THEN 15
    WHEN tm.first_name = 'Robert' AND p.code = 'TXE' THEN 10
    
    -- Jennifer White - UNDERUTILIZED (28 hours)
    WHEN tm.first_name = 'Jennifer' AND p.code = 'OOT' THEN 18
    WHEN tm.first_name = 'Jennifer' AND p.code = 'RHH' THEN 10
    
    ELSE 0
  END as hours,
  '4719112e-bac8-45b6-b001-e14a78e9583c' as company_id
FROM current_week cw
CROSS JOIN team_members tm
CROSS JOIN projects p
WHERE CASE 
  WHEN tm.first_name = 'Paul' AND p.code IN ('XYZ', 'ABC') THEN TRUE
  WHEN tm.first_name = 'Sarah' AND p.code IN ('HERB', 'XYX') THEN TRUE
  WHEN tm.first_name = 'Mike' AND p.code IN ('HXFX', 'KJS') THEN TRUE
  WHEN tm.first_name = 'Emma' AND p.code IN ('GMWH', 'TXE') THEN TRUE
  WHEN tm.first_name = 'David' AND p.code IN ('OOT', 'RHH') THEN TRUE
  WHEN tm.first_name = 'Lisa' AND p.code IN ('XYZ', 'ABC') THEN TRUE
  WHEN tm.first_name = 'James' AND p.code IN ('HERB', 'XYX') THEN TRUE
  WHEN tm.first_name = 'Anna' AND p.code IN ('HXFX', 'KJS') THEN TRUE
  WHEN tm.first_name = 'Robert' AND p.code IN ('GMWH', 'TXE') THEN TRUE
  WHEN tm.first_name = 'Jennifer' AND p.code IN ('OOT', 'RHH') THEN TRUE
  ELSE FALSE
END;