-- Create demo company and demo user profile
INSERT INTO public.companies (
  id,
  name,
  subdomain,
  description,
  industry,
  size,
  city,
  country,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Acme Corporation',
  'demo-acme',
  'A leading technology company specializing in innovative solutions for modern businesses.',
  'Technology',
  '51-200 employees',
  'San Francisco',
  'United States',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Create demo user profile
INSERT INTO public.profiles (
  id,
  company_id,
  role,
  email,
  first_name,
  last_name,
  job_title,
  department,
  location,
  weekly_capacity,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'owner',
  'demo@example.com',
  'John',
  'Demo',
  'CEO',
  'Executive',
  'San Francisco, CA',
  40,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Create sample office locations for demo
INSERT INTO public.office_locations (
  id,
  company_id,
  city,
  country,
  code,
  emoji,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'San Francisco',
  'United States',
  'SF',
  '🌉',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'New York',
  'United States',
  'NY',
  '🗽',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample departments for demo
INSERT INTO public.office_departments (
  id,
  company_id,
  name,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  'Engineering',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000021',
  '00000000-0000-0000-0000-000000000001',
  'Product',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000022',
  '00000000-0000-0000-0000-000000000001',
  'Marketing',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample office from offices table (needed for projects)
INSERT INTO public.offices (
  id,
  name,
  country,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000030',
  'San Francisco Office',
  'United States',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample projects for demo
INSERT INTO public.projects (
  id,
  company_id,
  office_id,
  project_manager_id,
  code,
  name,
  country,
  current_stage,
  status,
  target_profit_percentage,
  budget_amount,
  budget_hours,
  contract_start_date,
  contract_end_date,
  financial_status,
  currency,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000040',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000002',
  'PRJ001',
  'Mobile App Redesign',
  'United States',
  'Development',
  'In Progress',
  20,
  150000,
  1200,
  '2024-01-15',
  '2024-06-15',
  'On Track',
  'USD',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000041',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000002',
  'PRJ002',
  'E-commerce Platform',
  'United States',
  'Planning',
  'Planning',
  25,
  300000,
  2400,
  '2024-03-01',
  '2024-12-31',
  'On Track',
  'USD',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create additional demo team members
INSERT INTO public.profiles (
  id,
  company_id,
  role,
  email,
  first_name,
  last_name,
  job_title,
  department,
  location,
  weekly_capacity,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'admin',
  'sarah.admin@example.com',
  'Sarah',
  'Wilson',
  'VP of Engineering',
  'Engineering',
  'San Francisco, CA',
  40,
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'member',
  'alex.dev@example.com',
  'Alex',
  'Chen',
  'Senior Developer',
  'Engineering',
  'San Francisco, CA',
  40,
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'member',
  'maria.designer@example.com',
  'Maria',
  'Rodriguez',
  'UX Designer',
  'Product',
  'New York, NY',
  40,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;