/**
 * Comprehensive demo data for the application
 * This data is used when the application is in demo mode
 */

import { format, startOfWeek, addDays, addWeeks } from 'date-fns';

export const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';

// Demo team members with realistic data
export const DEMO_TEAM_MEMBERS = [
  {
    id: '00000000-0000-0000-0000-000000000002',
    company_id: DEMO_COMPANY_ID,
    email: 'john.demo@bareresource.com',
    first_name: 'John',
    last_name: 'Mitchell',
    job_title: 'Principal Architect',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2020-03-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Leading our commercial architecture practice',
    manager_id: null,
    start_date: '2020-03-15',
    date_of_birth: '1985-06-15',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    company_id: DEMO_COMPANY_ID,
    email: 'sarah.wilson@bareresource.com',
    first_name: 'Sarah',
    last_name: 'Wilson',
    job_title: 'Senior Architect',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2021-01-10T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Specializing in sustainable residential design',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2021-01-10',
    date_of_birth: '1988-12-20',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    company_id: DEMO_COMPANY_ID,
    email: 'alex.chen@bareresource.com',
    first_name: 'Alex',
    last_name: 'Chen',
    job_title: 'Project Architect',
    department: 'Architecture',
    location: 'Los Angeles',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2022-06-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Project delivery specialist',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2022-06-01',
    date_of_birth: '1992-03-08',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    company_id: DEMO_COMPANY_ID,
    email: 'maria.rodriguez@bareresource.com',
    first_name: 'Maria',
    last_name: 'Rodriguez',
    job_title: 'Interior Designer',
    department: 'Interiors',
    location: 'New York',
    practice_area: 'Hospitality',
    weekly_capacity: 40,
    created_at: '2023-02-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Creating inspiring interior spaces',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2023-02-15',
    date_of_birth: '1990-07-22',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    company_id: DEMO_COMPANY_ID,
    email: 'james.taylor@bareresource.com',
    first_name: 'James',
    last_name: 'Taylor',
    job_title: 'Landscape Architect',
    department: 'Landscape',
    location: 'Los Angeles',
    practice_area: 'Urban Design',
    weekly_capacity: 32,
    created_at: '2022-09-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Urban landscape specialist',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2022-09-01',
    date_of_birth: '1987-11-30',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    company_id: DEMO_COMPANY_ID,
    email: 'emma.johnson@bareresource.com',
    first_name: 'Emma',
    last_name: 'Johnson',
    job_title: 'Junior Architect',
    department: 'Architecture',
    location: 'Chicago',
    practice_area: 'Healthcare',
    weekly_capacity: 40,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Passionate about healthcare design',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2024-01-15',
    date_of_birth: '1996-04-12',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    company_id: DEMO_COMPANY_ID,
    email: 'michael.brown@bareresource.com',
    first_name: 'Michael',
    last_name: 'Brown',
    job_title: 'Technical Director',
    department: 'Technical',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2019-08-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'BIM and technical delivery expert',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2019-08-01',
    date_of_birth: '1983-09-25',
    office_role_id: null
  }
];

// Demo projects with realistic architecture project data
export const DEMO_PROJECTS = [
  {
    id: '00000000-0000-0000-0001-000000000001',
    company_id: DEMO_COMPANY_ID,
    name: 'Skyline Tower',
    code: 'SKY-001',
    status: 'Active',
    current_stage: 'Design Development',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000001',
    temp_office_location_id: '00000000-0000-0000-0003-000000000001',
    department: 'Commercial',
    department_icon: '🏢',
    contract_start_date: '2024-06-01',
    contract_end_date: '2025-12-31',
    project_manager_id: '00000000-0000-0000-0000-000000000002',
    budget_hours: 4500,
    consumed_hours: 1200,
    budget_amount: 850000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2024-06-01T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    company_id: DEMO_COMPANY_ID,
    name: 'Harbor View Residences',
    code: 'HVR-002',
    status: 'Active',
    current_stage: 'Schematic Design',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000001',
    temp_office_location_id: '00000000-0000-0000-0003-000000000001',
    department: 'Residential',
    department_icon: '🏠',
    contract_start_date: '2024-09-01',
    contract_end_date: '2026-03-31',
    project_manager_id: '00000000-0000-0000-0000-000000000003',
    budget_hours: 6200,
    consumed_hours: 450,
    budget_amount: 1200000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2024-09-01T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    company_id: DEMO_COMPANY_ID,
    name: 'Metro Health Center',
    code: 'MHC-003',
    status: 'Active',
    current_stage: 'Documentation',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000002',
    temp_office_location_id: '00000000-0000-0000-0003-000000000002',
    department: 'Healthcare',
    department_icon: '🏥',
    contract_start_date: '2023-03-01',
    contract_end_date: '2025-06-30',
    project_manager_id: '00000000-0000-0000-0000-000000000008',
    budget_hours: 8000,
    consumed_hours: 6200,
    budget_amount: 2100000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2023-03-01T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    company_id: DEMO_COMPANY_ID,
    name: 'Urban Park Plaza',
    code: 'UPP-004',
    status: 'Active',
    current_stage: 'Concept',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000002',
    temp_office_location_id: '00000000-0000-0000-0003-000000000002',
    department: 'Urban Design',
    department_icon: '🌳',
    contract_start_date: '2025-01-01',
    contract_end_date: '2026-12-31',
    project_manager_id: '00000000-0000-0000-0000-000000000006',
    budget_hours: 3200,
    consumed_hours: 80,
    budget_amount: 450000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2024-12-01T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000005',
    company_id: DEMO_COMPANY_ID,
    name: 'Boutique Hotel Renovation',
    code: 'BHR-005',
    status: 'Active',
    current_stage: 'Design Development',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000001',
    temp_office_location_id: '00000000-0000-0000-0003-000000000001',
    department: 'Hospitality',
    department_icon: '🏨',
    contract_start_date: '2024-08-01',
    contract_end_date: '2025-08-31',
    project_manager_id: '00000000-0000-0000-0000-000000000005',
    budget_hours: 2800,
    consumed_hours: 1100,
    budget_amount: 680000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2024-08-01T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000006',
    company_id: DEMO_COMPANY_ID,
    name: 'Tech Campus Phase 2',
    code: 'TCP-006',
    status: 'Pipeline',
    current_stage: 'Concept',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000003',
    temp_office_location_id: '00000000-0000-0000-0003-000000000003',
    department: 'Commercial',
    department_icon: '🏢',
    contract_start_date: '2025-04-01',
    contract_end_date: '2027-06-30',
    project_manager_id: '00000000-0000-0000-0000-000000000002',
    budget_hours: 12000,
    consumed_hours: 0,
    budget_amount: 3500000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2024-11-15T00:00:00Z',
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0001-000000000007',
    company_id: DEMO_COMPANY_ID,
    name: 'Riverside Apartments',
    code: 'RSA-007',
    status: 'Completed',
    current_stage: 'Construction',
    country: 'USA',
    office_id: '00000000-0000-0000-0002-000000000001',
    temp_office_location_id: '00000000-0000-0000-0003-000000000001',
    department: 'Residential',
    department_icon: '🏠',
    contract_start_date: '2022-01-01',
    contract_end_date: '2024-06-30',
    project_manager_id: '00000000-0000-0000-0000-000000000003',
    budget_hours: 5500,
    consumed_hours: 5420,
    budget_amount: 980000,
    currency: 'USD',
    stages: ['Concept', 'Schematic Design', 'Design Development', 'Documentation', 'Construction'],
    created_at: '2022-01-01T00:00:00Z',
    updated_at: new Date().toISOString()
  }
];

// Demo offices
export const DEMO_OFFICES = [
  { id: '00000000-0000-0000-0002-000000000001', name: 'New York', country: 'USA' },
  { id: '00000000-0000-0000-0002-000000000002', name: 'Los Angeles', country: 'USA' },
  { id: '00000000-0000-0000-0002-000000000003', name: 'Chicago', country: 'USA' }
];

// Demo office locations
export const DEMO_LOCATIONS = [
  { id: '00000000-0000-0000-0003-000000000001', company_id: DEMO_COMPANY_ID, code: 'NYC', city: 'New York', country: 'USA', emoji: '🗽' },
  { id: '00000000-0000-0000-0003-000000000002', company_id: DEMO_COMPANY_ID, code: 'LA', city: 'Los Angeles', country: 'USA', emoji: '🌴' },
  { id: '00000000-0000-0000-0003-000000000003', company_id: DEMO_COMPANY_ID, code: 'CHI', city: 'Chicago', country: 'USA', emoji: '🌆' }
];

// Demo departments
export const DEMO_DEPARTMENTS = [
  { id: '00000000-0000-0000-0004-000000000001', company_id: DEMO_COMPANY_ID, name: 'Architecture', icon: '🏛️' },
  { id: '00000000-0000-0000-0004-000000000002', company_id: DEMO_COMPANY_ID, name: 'Interiors', icon: '🎨' },
  { id: '00000000-0000-0000-0004-000000000003', company_id: DEMO_COMPANY_ID, name: 'Landscape', icon: '🌳' },
  { id: '00000000-0000-0000-0004-000000000004', company_id: DEMO_COMPANY_ID, name: 'Technical', icon: '⚙️' }
];

// Demo practice areas
export const DEMO_PRACTICE_AREAS = [
  { id: '00000000-0000-0000-0005-000000000001', company_id: DEMO_COMPANY_ID, name: 'Commercial', icon: '🏢' },
  { id: '00000000-0000-0000-0005-000000000002', company_id: DEMO_COMPANY_ID, name: 'Residential', icon: '🏠' },
  { id: '00000000-0000-0000-0005-000000000003', company_id: DEMO_COMPANY_ID, name: 'Healthcare', icon: '🏥' },
  { id: '00000000-0000-0000-0005-000000000004', company_id: DEMO_COMPANY_ID, name: 'Hospitality', icon: '🏨' },
  { id: '00000000-0000-0000-0005-000000000005', company_id: DEMO_COMPANY_ID, name: 'Urban Design', icon: '🌆' }
];

// Demo office stages
export const DEMO_STAGES = [
  { id: '00000000-0000-0000-0006-000000000001', company_id: DEMO_COMPANY_ID, name: 'Concept', code: 'CON', color: '#10B981', order_index: 1 },
  { id: '00000000-0000-0000-0006-000000000002', company_id: DEMO_COMPANY_ID, name: 'Schematic Design', code: 'SD', color: '#3B82F6', order_index: 2 },
  { id: '00000000-0000-0000-0006-000000000003', company_id: DEMO_COMPANY_ID, name: 'Design Development', code: 'DD', color: '#8B5CF6', order_index: 3 },
  { id: '00000000-0000-0000-0006-000000000004', company_id: DEMO_COMPANY_ID, name: 'Documentation', code: 'CD', color: '#F59E0B', order_index: 4 },
  { id: '00000000-0000-0000-0006-000000000005', company_id: DEMO_COMPANY_ID, name: 'Construction', code: 'CA', color: '#EF4444', order_index: 5 }
];

// Demo office roles
export const DEMO_ROLES = [
  { id: '00000000-0000-0000-0010-000000000001', company_id: DEMO_COMPANY_ID, name: 'Principal', code: 'PRIN', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000002', company_id: DEMO_COMPANY_ID, name: 'Associate Director', code: 'AD', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000003', company_id: DEMO_COMPANY_ID, name: 'Senior Architect', code: 'SA', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000004', company_id: DEMO_COMPANY_ID, name: 'Project Architect', code: 'PA', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000005', company_id: DEMO_COMPANY_ID, name: 'Architect', code: 'ARCH', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000006', company_id: DEMO_COMPANY_ID, name: 'Graduate Architect', code: 'GA', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000007', company_id: DEMO_COMPANY_ID, name: 'Interior Designer', code: 'ID', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0010-000000000008', company_id: DEMO_COMPANY_ID, name: 'Technical Director', code: 'TD', created_at: '2020-01-01T00:00:00Z', updated_at: new Date().toISOString() }
];

// Demo rates (cost rates per role)
export const DEMO_RATES = [
  { id: '00000000-0000-0000-0011-000000000001', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000001', value: 350, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000002', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000002', value: 280, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000003', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000003', value: 220, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000004', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000004', value: 180, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000005', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000005', value: 150, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000006', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000006', value: 95, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000007', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000007', value: 165, unit: 'hour' as const },
  { id: '00000000-0000-0000-0011-000000000008', company_id: DEMO_COMPANY_ID, type: 'role' as const, reference_id: '00000000-0000-0000-0010-000000000008', value: 260, unit: 'hour' as const }
];

// Demo project statuses
export const DEMO_PROJECT_STATUSES = [
  { id: '00000000-0000-0000-0012-000000000001', company_id: DEMO_COMPANY_ID, name: 'Active', order_index: 1, color: '#10B981' },
  { id: '00000000-0000-0000-0012-000000000002', company_id: DEMO_COMPANY_ID, name: 'On Hold', order_index: 2, color: '#F59E0B' },
  { id: '00000000-0000-0000-0012-000000000003', company_id: DEMO_COMPANY_ID, name: 'Pipeline', order_index: 3, color: '#3B82F6' },
  { id: '00000000-0000-0000-0012-000000000004', company_id: DEMO_COMPANY_ID, name: 'Completed', order_index: 4, color: '#6B7280' },
  { id: '00000000-0000-0000-0012-000000000005', company_id: DEMO_COMPANY_ID, name: 'Archived', order_index: 5, color: '#9CA3AF' }
];

// Demo project types
export const DEMO_PROJECT_TYPES = [
  { id: '00000000-0000-0000-0013-000000000001', company_id: DEMO_COMPANY_ID, name: 'New Build', order_index: 1, icon: '🏗️', color: '#10B981' },
  { id: '00000000-0000-0000-0013-000000000002', company_id: DEMO_COMPANY_ID, name: 'Renovation', order_index: 2, icon: '🔨', color: '#F59E0B' },
  { id: '00000000-0000-0000-0013-000000000003', company_id: DEMO_COMPANY_ID, name: 'Fit-out', order_index: 3, icon: '🎨', color: '#8B5CF6' },
  { id: '00000000-0000-0000-0013-000000000004', company_id: DEMO_COMPANY_ID, name: 'Masterplan', order_index: 4, icon: '🗺️', color: '#3B82F6' },
  { id: '00000000-0000-0000-0013-000000000005', company_id: DEMO_COMPANY_ID, name: 'Feasibility Study', order_index: 5, icon: '📊', color: '#EC4899' }
];

// Demo company
export const DEMO_COMPANY = {
  id: DEMO_COMPANY_ID,
  name: 'Demo Architecture Studio',
  subdomain: 'demo',
  description: 'A forward-thinking architecture practice',
  industry: 'Architecture',
  size: '25-50',
  website: 'https://demo.bareresource.com',
  work_week_hours: 40,
  start_of_work_week: 'Monday',
  allocation_warning_threshold: 80,
  allocation_danger_threshold: 100,
  allocation_max_limit: 120,
  use_hours_or_percentage: 'hours',
  project_display_preference: 'name',
  theme: 'purple',
  created_at: '2020-01-01T00:00:00Z',
  updated_at: new Date().toISOString()
};

// Demo pre-registered invites (pending team members)
export const DEMO_PRE_REGISTERED = [
  {
    id: '00000000-0000-0000-0009-000000000001',
    company_id: DEMO_COMPANY_ID,
    email: 'david.kim@bareresource.com',
    first_name: 'David',
    last_name: 'Kim',
    job_title: 'Senior Designer',
    department: 'Interiors',
    location: 'Los Angeles',
    weekly_capacity: 40,
    status: 'pending',
    invitation_type: 'pre_registered',
    code: 'DEMO-001',
    created_by: '00000000-0000-0000-0000-000000000002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0009-000000000002',
    company_id: DEMO_COMPANY_ID,
    email: 'lisa.wang@bareresource.com',
    first_name: 'Lisa',
    last_name: 'Wang',
    job_title: 'BIM Specialist',
    department: 'Technical',
    location: 'New York',
    weekly_capacity: 40,
    status: 'pending',
    invitation_type: 'pre_registered',
    code: 'DEMO-002',
    created_by: '00000000-0000-0000-0000-000000000002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Demo holidays - static list for HolidaysTab display (transformed format)
export const DEMO_HOLIDAYS = [
  {
    id: '00000000-0000-0000-000A-000000000001',
    name: 'New Year\'s Day',
    date: new Date('2026-01-01'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000002',
    name: 'Martin Luther King Jr. Day',
    date: new Date('2026-01-19'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000003',
    name: 'Presidents\' Day',
    date: new Date('2026-02-16'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000004',
    name: 'NYC Studio Day',
    date: new Date('2026-02-20'),
    offices: ['00000000-0000-0000-0003-000000000001'],
    is_recurring: false,
    company_id: DEMO_COMPANY_ID,
    location_id: '00000000-0000-0000-0003-000000000001'
  },
  {
    id: '00000000-0000-0000-000A-000000000005',
    name: 'LA Office Retreat',
    date: new Date('2026-03-06'),
    offices: ['00000000-0000-0000-0003-000000000002'],
    is_recurring: false,
    company_id: DEMO_COMPANY_ID,
    location_id: '00000000-0000-0000-0003-000000000002'
  },
  {
    id: '00000000-0000-0000-000A-000000000006',
    name: 'Memorial Day',
    date: new Date('2026-05-25'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000007',
    name: 'Independence Day',
    date: new Date('2026-07-04'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000008',
    name: 'Thanksgiving',
    date: new Date('2025-11-27'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  },
  {
    id: '00000000-0000-0000-000A-000000000009',
    name: 'Christmas Day',
    date: new Date('2025-12-25'),
    offices: ['00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0003-000000000003'],
    is_recurring: true,
    company_id: DEMO_COMPANY_ID
  }
];

// Legacy function for backward compatibility
export const generateDemoHolidays = () => {
  const today = new Date();
  return [
    {
      id: '00000000-0000-0000-000A-000000000001',
      company_id: DEMO_COMPANY_ID,
      name: 'Independence Day',
      date: format(addDays(today, 14), 'yyyy-MM-dd'),
      location_id: null,
      is_recurring: true,
      office_locations: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

// Demo team composition data
export const DEMO_TEAM_COMPOSITION = [
  { id: '00000000-0000-0000-000B-000000000001', company_id: DEMO_COMPANY_ID, project_id: '00000000-0000-0000-0001-000000000001', title: 'Principal', number_of_people: 1 },
  { id: '00000000-0000-0000-000B-000000000002', company_id: DEMO_COMPANY_ID, project_id: '00000000-0000-0000-0001-000000000001', title: 'Project Architect', number_of_people: 2 },
  { id: '00000000-0000-0000-000B-000000000003', company_id: DEMO_COMPANY_ID, project_id: '00000000-0000-0000-0001-000000000002', title: 'Senior Architect', number_of_people: 1 },
  { id: '00000000-0000-0000-000B-000000000004', company_id: DEMO_COMPANY_ID, project_id: '00000000-0000-0000-0001-000000000003', title: 'Technical Director', number_of_people: 1 }
];

// Helper function to generate resource allocations spanning Oct 2025 - Mar 2026
// Returns allocations with realistic patterns - some overloaded, some underutilized
export const generateDemoAllocations = () => {
  const allocations: any[] = [];

  // Extended date range: October 2025 to end of March 2026
  const rangeStart = new Date('2025-10-06'); // First Monday of October 2025
  const rangeEnd = new Date('2026-03-31');

  // Allocation patterns for each team member per project
  // Designed to show: John (80%), Sarah (105% overloaded), Alex (110% overloaded), 
  // Maria (80%), James (75% part-time), Emma (60% underutilized), Michael (95%)
  const allocationPatterns = [
    // John Mitchell - 32h/week = 80% utilization
    { memberId: '00000000-0000-0000-0000-000000000002', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 20 },
    { memberId: '00000000-0000-0000-0000-000000000002', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 12 },

    // Sarah Wilson - 42h/week = 105% (overloaded)
    { memberId: '00000000-0000-0000-0000-000000000003', projectId: '00000000-0000-0000-0001-000000000002', hoursPerWeek: 28 },
    { memberId: '00000000-0000-0000-0000-000000000003', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 14 },

    // Alex Chen - 44h/week = 110% (overloaded)
    { memberId: '00000000-0000-0000-0000-000000000004', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 24 },
    { memberId: '00000000-0000-0000-0000-000000000004', projectId: '00000000-0000-0000-0001-000000000005', hoursPerWeek: 20 },

    // Maria Rodriguez - 32h/week = 80%
    { memberId: '00000000-0000-0000-0000-000000000005', projectId: '00000000-0000-0000-0001-000000000005', hoursPerWeek: 32 },

    // James Taylor - 24h/week = 75% of 32h capacity
    { memberId: '00000000-0000-0000-0000-000000000006', projectId: '00000000-0000-0000-0001-000000000004', hoursPerWeek: 24 },

    // Emma Johnson - 24h/week = 60% (underutilized)
    { memberId: '00000000-0000-0000-0000-000000000007', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 24 },

    // Michael Brown - 38h/week = 95%
    { memberId: '00000000-0000-0000-0000-000000000008', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 22 },
    { memberId: '00000000-0000-0000-0000-000000000008', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 16 },
  ];

  // Generate allocations for each week in the range
  let currentDate = new Date(rangeStart);
  while (currentDate <= rangeEnd) {
    // Only generate for weekdays (Mon-Fri)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');

      allocationPatterns.forEach((pattern, idx) => {
        // Use integer daily hours to avoid floating-point artifacts in weekly totals.
        // Example: 22h/week => 5,5,4,4,4 across Mon-Fri.
        const weekdayIndex = dayOfWeek - 1; // Mon=0 .. Fri=4
        const base = Math.floor(pattern.hoursPerWeek / 5);
        const remainder = pattern.hoursPerWeek % 5;
        const dailyHours = base + (weekdayIndex < remainder ? 1 : 0);

        if (dailyHours > 0) {
          allocations.push({
            id: `demo-alloc-${dateStr}-${idx}`,
            company_id: DEMO_COMPANY_ID,
            project_id: pattern.projectId,
            resource_id: pattern.memberId,
            resource_type: 'active',
            allocation_date: dateStr,
            hours: dailyHours,
            stage_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      });
    }
    currentDate = addDays(currentDate, 1);
  }

  return allocations;
};


// Demo leave types
export const DEMO_LEAVE_TYPES = [
  { id: '00000000-0000-0000-0007-000000000001', company_id: DEMO_COMPANY_ID, name: 'Annual Leave', code: 'AL', color: '#10B981', icon: '🏖️', is_active: true },
  { id: '00000000-0000-0000-0007-000000000002', company_id: DEMO_COMPANY_ID, name: 'Sick Leave', code: 'SL', color: '#EF4444', icon: '🤒', is_active: true },
  { id: '00000000-0000-0000-0007-000000000003', company_id: DEMO_COMPANY_ID, name: 'Personal Leave', code: 'PL', color: '#8B5CF6', icon: '👤', is_active: true },
  { id: '00000000-0000-0000-0007-000000000004', company_id: DEMO_COMPANY_ID, name: 'Parental Leave', code: 'PAR', color: '#F59E0B', icon: '👶', is_active: true }
];

// Demo leave requests
export const generateDemoLeaveRequests = () => {
  const today = new Date();
  
  return [
    {
      id: '00000000-0000-0000-0008-000000000001',
      company_id: DEMO_COMPANY_ID,
      member_id: '00000000-0000-0000-0000-000000000004',
      leave_type_id: '00000000-0000-0000-0007-000000000001',
      start_date: format(addDays(today, 7), 'yyyy-MM-dd'),
      end_date: format(addDays(today, 11), 'yyyy-MM-dd'),
      duration_type: 'full_day',
      total_hours: 40,
      status: 'approved',
      remarks: 'Summer vacation',
      approved_by: '00000000-0000-0000-0000-000000000002',
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '00000000-0000-0000-0008-000000000002',
      company_id: DEMO_COMPANY_ID,
      member_id: '00000000-0000-0000-0000-000000000005',
      leave_type_id: '00000000-0000-0000-0007-000000000003',
      start_date: format(addDays(today, 14), 'yyyy-MM-dd'),
      end_date: format(addDays(today, 14), 'yyyy-MM-dd'),
      duration_type: 'full_day',
      total_hours: 8,
      status: 'pending',
      remarks: 'Personal appointment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

// Demo annual leaves (for utilization calculation)
// Extended to include more realistic leave patterns across the team
export const generateDemoAnnualLeaves = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  return [
    // Alex Chen - vacation next week (5 days)
    { id: '00000000-0000-0000-000C-000000000001', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000004', date: format(addDays(weekStart, 7), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    { id: '00000000-0000-0000-000C-000000000002', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000004', date: format(addDays(weekStart, 8), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    { id: '00000000-0000-0000-000C-000000000003', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000004', date: format(addDays(weekStart, 9), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    { id: '00000000-0000-0000-000C-000000000004', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000004', date: format(addDays(weekStart, 10), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    { id: '00000000-0000-0000-000C-000000000005', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000004', date: format(addDays(weekStart, 11), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    
    // Maria Rodriguez - personal day this week
    { id: '00000000-0000-0000-000C-000000000006', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000005', date: format(addDays(weekStart, 3), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000003' },
    
    // Emma Johnson - sick leave (2 days in 2 weeks)
    { id: '00000000-0000-0000-000C-000000000007', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000007', date: format(addDays(weekStart, 14), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000002' },
    { id: '00000000-0000-0000-000C-000000000008', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000007', date: format(addDays(weekStart, 15), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000002' },
    
    // James Taylor - half day personal
    { id: '00000000-0000-0000-000C-000000000009', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000006', date: format(addDays(weekStart, 4), 'yyyy-MM-dd'), hours: 4, leave_type_id: '00000000-0000-0000-0007-000000000003' },
    
    // Sarah Wilson - 2 days vacation in 3 weeks
    { id: '00000000-0000-0000-000C-000000000010', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000003', date: format(addDays(weekStart, 21), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' },
    { id: '00000000-0000-0000-000C-000000000011', company_id: DEMO_COMPANY_ID, member_id: '00000000-0000-0000-0000-000000000003', date: format(addDays(weekStart, 22), 'yyyy-MM-dd'), hours: 8, leave_type_id: '00000000-0000-0000-0007-000000000001' }
  ];
};

// Demo metrics for dashboard
export const DEMO_METRICS = {
  activeProjects: 5,
  activeResources: 7,
  totalRevenue: 9760000,
  avgProjectValue: 1394285,
  utilizationTrends: {
    days7: 82,
    days30: 78,
    days90: 75
  },
  projectsByStatus: [
    { name: 'Active', value: 5 },
    { name: 'Pipeline', value: 1 },
    { name: 'Completed', value: 1 }
  ],
  projectsByStage: [
    { name: 'Concept', value: 2, color: '#10B981' },
    { name: 'Schematic Design', value: 1, color: '#3B82F6' },
    { name: 'Design Development', value: 2, color: '#8B5CF6' },
    { name: 'Documentation', value: 1, color: '#F59E0B' },
    { name: 'Construction', value: 1, color: '#EF4444' }
  ],
  projectsByLocation: [
    { name: 'USA', value: 7, color: '#059669' }
  ],
  projectsByPM: [
    { name: 'John Mitchell', value: 2 },
    { name: 'Sarah Wilson', value: 2 },
    { name: 'Michael Brown', value: 1 },
    { name: 'James Taylor', value: 1 },
    { name: 'Maria Rodriguez', value: 1 }
  ]
};

// Export all demo data
export const DEMO_DATA = {
  company: DEMO_COMPANY,
  teamMembers: DEMO_TEAM_MEMBERS,
  projects: DEMO_PROJECTS,
  offices: DEMO_OFFICES,
  locations: DEMO_LOCATIONS,
  departments: DEMO_DEPARTMENTS,
  practiceAreas: DEMO_PRACTICE_AREAS,
  stages: DEMO_STAGES,
  roles: DEMO_ROLES,
  rates: DEMO_RATES,
  projectStatuses: DEMO_PROJECT_STATUSES,
  projectTypes: DEMO_PROJECT_TYPES,
  leaveTypes: DEMO_LEAVE_TYPES,
  holidays: DEMO_HOLIDAYS,
  preRegistered: DEMO_PRE_REGISTERED,
  teamComposition: DEMO_TEAM_COMPOSITION,
  metrics: DEMO_METRICS,
  getAllocations: generateDemoAllocations,
  getHolidays: generateDemoHolidays,
  getLeaveRequests: generateDemoLeaveRequests,
  getAnnualLeaves: generateDemoAnnualLeaves
};

export default DEMO_DATA;
