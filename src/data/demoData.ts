/**
 * Comprehensive demo data for the application
 * This data is used when the application is in demo mode
 */

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

// Helper function to generate resource allocations for the next 12 weeks
export const generateDemoAllocations = () => {
  const allocations: any[] = [];
  const today = new Date();
  
  // Get start of current week (Monday)
  const startOfWeek = new Date(today);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Allocation patterns for each team member per project
  const allocationPatterns = [
    { memberId: '00000000-0000-0000-0000-000000000002', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 24 },
    { memberId: '00000000-0000-0000-0000-000000000002', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 8 },
    { memberId: '00000000-0000-0000-0000-000000000003', projectId: '00000000-0000-0000-0001-000000000002', hoursPerWeek: 32 },
    { memberId: '00000000-0000-0000-0000-000000000004', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 16 },
    { memberId: '00000000-0000-0000-0000-000000000004', projectId: '00000000-0000-0000-0001-000000000005', hoursPerWeek: 24 },
    { memberId: '00000000-0000-0000-0000-000000000005', projectId: '00000000-0000-0000-0001-000000000005', hoursPerWeek: 32 },
    { memberId: '00000000-0000-0000-0000-000000000006', projectId: '00000000-0000-0000-0001-000000000004', hoursPerWeek: 24 },
    { memberId: '00000000-0000-0000-0000-000000000007', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 32 },
    { memberId: '00000000-0000-0000-0000-000000000008', projectId: '00000000-0000-0000-0001-000000000003', hoursPerWeek: 24 },
    { memberId: '00000000-0000-0000-0000-000000000008', projectId: '00000000-0000-0000-0001-000000000001', hoursPerWeek: 8 }
  ];

  // Generate 12 weeks of allocations
  for (let week = 0; week < 12; week++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(weekStart.getDate() + (week * 7));

    // Generate daily allocations for each weekday
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      allocationPatterns.forEach((pattern, idx) => {
        // Daily hours = weekly hours / 5 with some variation
        const baseDaily = pattern.hoursPerWeek / 5;
        const variation = (Math.random() - 0.5) * 2; // +/- 1 hour variation
        const dailyHours = Math.max(0, Math.min(8, baseDaily + variation));

        if (dailyHours > 0) {
          allocations.push({
            id: `demo-alloc-${week}-${dayOffset}-${idx}`,
            company_id: DEMO_COMPANY_ID,
            project_id: pattern.projectId,
            resource_id: pattern.memberId,
            resource_type: 'profile',
            allocation_date: dateStr,
            hours: Math.round(dailyHours * 10) / 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    }
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
      start_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      start_date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end_date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration_type: 'full_day',
      total_hours: 8,
      status: 'pending',
      remarks: 'Personal appointment',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
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
  leaveTypes: DEMO_LEAVE_TYPES,
  getAllocations: generateDemoAllocations,
  getLeaveRequests: generateDemoLeaveRequests
};

export default DEMO_DATA;
