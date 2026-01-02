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
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
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
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'BIM and technical delivery expert',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2019-08-01',
    date_of_birth: '1983-09-25',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    company_id: DEMO_COMPANY_ID,
    email: 'olivia.martinez@bareresource.com',
    first_name: 'Olivia',
    last_name: 'Martinez',
    job_title: 'Senior Interior Designer',
    department: 'Interiors',
    location: 'Los Angeles',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2021-05-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Luxury residential interiors specialist',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2021-05-01',
    date_of_birth: '1989-08-14',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000010',
    company_id: DEMO_COMPANY_ID,
    email: 'david.kim@bareresource.com',
    first_name: 'David',
    last_name: 'Kim',
    job_title: 'Associate Architect',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2020-11-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'High-rise commercial projects expert',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2020-11-15',
    date_of_birth: '1986-02-28',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    company_id: DEMO_COMPANY_ID,
    email: 'rachel.green@bareresource.com',
    first_name: 'Rachel',
    last_name: 'Green',
    job_title: 'Project Manager',
    department: 'Architecture',
    location: 'Chicago',
    practice_area: 'Healthcare',
    weekly_capacity: 40,
    created_at: '2022-03-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Ensuring projects deliver on time and budget',
    manager_id: '00000000-0000-0000-0000-000000000008',
    start_date: '2022-03-01',
    date_of_birth: '1991-10-05',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    company_id: DEMO_COMPANY_ID,
    email: 'william.park@bareresource.com',
    first_name: 'William',
    last_name: 'Park',
    job_title: 'BIM Manager',
    department: 'Technical',
    location: 'Los Angeles',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2021-08-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Leading digital delivery initiatives',
    manager_id: '00000000-0000-0000-0000-000000000008',
    start_date: '2021-08-15',
    date_of_birth: '1988-04-18',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    company_id: DEMO_COMPANY_ID,
    email: 'sophia.lee@bareresource.com',
    first_name: 'Sophia',
    last_name: 'Lee',
    job_title: 'Graduate Architect',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2024-06-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    bio: 'Eager to learn and contribute to great design',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2024-06-01',
    date_of_birth: '1998-01-22',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    company_id: DEMO_COMPANY_ID,
    email: 'daniel.wright@bareresource.com',
    first_name: 'Daniel',
    last_name: 'Wright',
    job_title: 'Senior Landscape Architect',
    department: 'Landscape',
    location: 'Chicago',
    practice_area: 'Urban Design',
    weekly_capacity: 40,
    created_at: '2020-02-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    bio: 'Creating sustainable urban environments',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2020-02-01',
    date_of_birth: '1984-07-09',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000015',
    company_id: DEMO_COMPANY_ID,
    email: 'isabella.garcia@bareresource.com',
    first_name: 'Isabella',
    last_name: 'Garcia',
    job_title: 'Visualization Specialist',
    department: 'Technical',
    location: 'Los Angeles',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2023-04-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Bringing designs to life through visualization',
    manager_id: '00000000-0000-0000-0000-000000000008',
    start_date: '2023-04-15',
    date_of_birth: '1993-11-12',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000016',
    company_id: DEMO_COMPANY_ID,
    email: 'ethan.moore@bareresource.com',
    first_name: 'Ethan',
    last_name: 'Moore',
    job_title: 'Sustainability Consultant',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 32,
    created_at: '2022-01-10T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    bio: 'Driving sustainable design solutions',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2022-01-10',
    date_of_birth: '1990-05-25',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000017',
    company_id: DEMO_COMPANY_ID,
    email: 'nathan.foster@bareresource.com',
    first_name: 'Nathan',
    last_name: 'Foster',
    job_title: 'Design Architect',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2021-09-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Focused on innovative commercial design',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2021-09-15',
    date_of_birth: '1989-03-17',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000018',
    company_id: DEMO_COMPANY_ID,
    email: 'hannah.bell@bareresource.com',
    first_name: 'Hannah',
    last_name: 'Bell',
    job_title: 'Interior Architect',
    department: 'Interiors',
    location: 'Chicago',
    practice_area: 'Hospitality',
    weekly_capacity: 40,
    created_at: '2022-11-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    bio: 'Creating memorable hospitality spaces',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2022-11-01',
    date_of_birth: '1991-08-24',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000019',
    company_id: DEMO_COMPANY_ID,
    email: 'lucas.reed@bareresource.com',
    first_name: 'Lucas',
    last_name: 'Reed',
    job_title: 'Architectural Technician',
    department: 'Technical',
    location: 'Los Angeles',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2023-07-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Technical documentation specialist',
    manager_id: '00000000-0000-0000-0000-000000000008',
    start_date: '2023-07-01',
    date_of_birth: '1994-12-03',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000020',
    company_id: DEMO_COMPANY_ID,
    email: 'grace.murphy@bareresource.com',
    first_name: 'Grace',
    last_name: 'Murphy',
    job_title: 'Project Coordinator',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Healthcare',
    weekly_capacity: 40,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    bio: 'Keeping projects on track',
    manager_id: '00000000-0000-0000-0000-000000000011',
    start_date: '2024-03-01',
    date_of_birth: '1995-06-18',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000021',
    company_id: DEMO_COMPANY_ID,
    email: 'owen.hayes@bareresource.com',
    first_name: 'Owen',
    last_name: 'Hayes',
    job_title: 'Senior Designer',
    department: 'Architecture',
    location: 'Chicago',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2020-06-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    bio: 'Award-winning commercial design',
    manager_id: '00000000-0000-0000-0000-000000000002',
    start_date: '2020-06-15',
    date_of_birth: '1986-10-09',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000022',
    company_id: DEMO_COMPANY_ID,
    email: 'chloe.brooks@bareresource.com',
    first_name: 'Chloe',
    last_name: 'Brooks',
    job_title: 'Landscape Designer',
    department: 'Landscape',
    location: 'Los Angeles',
    practice_area: 'Urban Design',
    weekly_capacity: 40,
    created_at: '2023-01-10T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Sustainable landscape solutions',
    manager_id: '00000000-0000-0000-0000-000000000014',
    start_date: '2023-01-10',
    date_of_birth: '1992-04-27',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000023',
    company_id: DEMO_COMPANY_ID,
    email: 'ryan.collins@bareresource.com',
    first_name: 'Ryan',
    last_name: 'Collins',
    job_title: 'BIM Specialist',
    department: 'Technical',
    location: 'New York',
    practice_area: 'Commercial',
    weekly_capacity: 40,
    created_at: '2022-05-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    bio: 'BIM modeling and coordination expert',
    manager_id: '00000000-0000-0000-0000-000000000012',
    start_date: '2022-05-01',
    date_of_birth: '1990-11-14',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000024',
    company_id: DEMO_COMPANY_ID,
    email: 'mia.stewart@bareresource.com',
    first_name: 'Mia',
    last_name: 'Stewart',
    job_title: 'Junior Designer',
    department: 'Interiors',
    location: 'Los Angeles',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2024-08-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    bio: 'Fresh perspective on residential interiors',
    manager_id: '00000000-0000-0000-0000-000000000009',
    start_date: '2024-08-15',
    date_of_birth: '1997-09-22',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000025',
    company_id: DEMO_COMPANY_ID,
    email: 'jack.morgan@bareresource.com',
    first_name: 'Jack',
    last_name: 'Morgan',
    job_title: 'Construction Administrator',
    department: 'Architecture',
    location: 'Chicago',
    practice_area: 'Healthcare',
    weekly_capacity: 40,
    created_at: '2021-04-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Ensuring quality construction delivery',
    manager_id: '00000000-0000-0000-0000-000000000008',
    start_date: '2021-04-01',
    date_of_birth: '1987-02-11',
    office_role_id: null
  },
  {
    id: '00000000-0000-0000-0000-000000000026',
    company_id: DEMO_COMPANY_ID,
    email: 'ava.price@bareresource.com',
    first_name: 'Ava',
    last_name: 'Price',
    job_title: 'Design Coordinator',
    department: 'Architecture',
    location: 'New York',
    practice_area: 'Residential',
    weekly_capacity: 40,
    created_at: '2023-09-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    avatar_url: null,
    bio: 'Coordinating design excellence',
    manager_id: '00000000-0000-0000-0000-000000000003',
    start_date: '2023-09-01',
    date_of_birth: '1993-07-30',
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

// Seeded random number generator for consistent demo data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Helper to add variance to hours (realistic weekly fluctuations)
const varyHours = (baseHours: number, weekIndex: number, memberId: string, projectId: string): number => {
  // Create a unique seed for this member/project/week combination
  const seed = weekIndex * 1000 + memberId.charCodeAt(memberId.length - 1) * 100 + projectId.charCodeAt(projectId.length - 1);
  const random = seededRandom(seed);
  
  // Variance patterns: -30% to +40% of base hours
  const varianceFactor = 0.7 + (random * 0.7); // 0.7 to 1.4
  const varied = Math.round(baseHours * varianceFactor);
  
  // Clamp to reasonable bounds
  return Math.max(0, Math.min(varied, 48));
};

// Helper function to generate resource allocations spanning Oct 2025 - Mar 2026
// Returns allocations with REALISTIC VARIED patterns - not static hours every week
export const generateDemoAllocations = () => {
  const allocations: any[] = [];

  // Extended date range: October 2025 to end of March 2026
  const rangeStart = new Date('2025-10-06'); // First Monday of October 2025
  const rangeEnd = new Date('2026-03-31');
  
  // Total weeks in range
  const totalWeeks = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (7 * 24 * 60 * 60 * 1000));

  // Define realistic allocation patterns with project phases
  // Each pattern includes: base hours, start week offset, end week offset (relative to project lifecycle)
  const memberProjectPatterns = [
    // John Mitchell - Principal, multiple projects with varying intensity
    { 
      memberId: '00000000-0000-0000-0000-000000000002', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 20, rampUp: 3, peakWeeks: [4, 5, 6, 12, 13], lightWeeks: [8, 9, 16, 17] },
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 12, rampUp: 0, peakWeeks: [2, 3, 10, 11], lightWeeks: [6, 7, 14, 15, 20] }
      ]
    },
    // Sarah Wilson - Senior, heavy on Harbor View with occasional overload
    { 
      memberId: '00000000-0000-0000-0000-000000000003', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 28, rampUp: 2, peakWeeks: [5, 6, 7, 13, 14, 15], lightWeeks: [0, 1, 10, 18, 19] },
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 14, rampUp: 4, peakWeeks: [8, 9, 16, 17], lightWeeks: [3, 4, 12, 13, 20, 21] }
      ]
    },
    // Alex Chen - Project Architect, high intensity with project switches
    { 
      memberId: '00000000-0000-0000-0000-000000000004', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 24, rampUp: 1, peakWeeks: [3, 4, 5, 11, 12], lightWeeks: [8, 9, 15, 16, 22] },
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 20, rampUp: 2, peakWeeks: [6, 7, 8, 14, 15, 16], lightWeeks: [2, 3, 11, 12, 20] }
      ]
    },
    // Maria Rodriguez - Interior Designer, focused on hotel with varying weeks
    { 
      memberId: '00000000-0000-0000-0000-000000000005', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 32, rampUp: 3, peakWeeks: [4, 5, 6, 12, 13, 14], lightWeeks: [0, 1, 9, 10, 18, 19] }
      ]
    },
    // James Taylor - Landscape (part-time 32h capacity), Urban Park focused
    { 
      memberId: '00000000-0000-0000-0000-000000000006', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000004', baseHours: 24, rampUp: 5, peakWeeks: [7, 8, 9, 15, 16], lightWeeks: [0, 1, 2, 12, 13, 20, 21] }
      ]
    },
    // Emma Johnson - Junior, ramping up gradually on healthcare project
    { 
      memberId: '00000000-0000-0000-0000-000000000007', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 24, rampUp: 6, peakWeeks: [10, 11, 12, 18, 19], lightWeeks: [0, 1, 2, 3, 4, 5, 15, 16] }
      ]
    },
    // Michael Brown - Tech Director, multiple critical projects
    { 
      memberId: '00000000-0000-0000-0000-000000000008', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 22, rampUp: 0, peakWeeks: [2, 3, 4, 10, 11, 12, 18], lightWeeks: [7, 8, 15, 16] },
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 16, rampUp: 2, peakWeeks: [5, 6, 13, 14], lightWeeks: [0, 1, 9, 10, 17, 18, 22, 23] }
      ]
    },
    // Olivia Martinez - Senior Interior Designer, residential focus
    { 
      memberId: '00000000-0000-0000-0000-000000000009', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 28, rampUp: 2, peakWeeks: [3, 4, 5, 11, 12, 13], lightWeeks: [0, 1, 8, 9, 17, 18] },
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 12, rampUp: 3, peakWeeks: [6, 7, 14, 15], lightWeeks: [2, 10, 19, 20] }
      ]
    },
    // David Kim - Associate Architect, commercial projects
    { 
      memberId: '00000000-0000-0000-0000-000000000010', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 32, rampUp: 1, peakWeeks: [4, 5, 6, 12, 13, 14], lightWeeks: [0, 8, 9, 17, 18] },
        { projectId: '00000000-0000-0000-0001-000000000006', baseHours: 8, rampUp: 4, peakWeeks: [10, 11, 19, 20], lightWeeks: [1, 2, 3, 7, 8] }
      ]
    },
    // Rachel Green - Project Manager, healthcare focus
    { 
      memberId: '00000000-0000-0000-0000-000000000011', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 30, rampUp: 0, peakWeeks: [2, 3, 10, 11, 18, 19], lightWeeks: [6, 7, 14, 15] },
        { projectId: '00000000-0000-0000-0001-000000000004', baseHours: 10, rampUp: 2, peakWeeks: [8, 9, 16, 17], lightWeeks: [0, 1, 4, 5, 12, 13] }
      ]
    },
    // William Park - BIM Manager, technical oversight
    { 
      memberId: '00000000-0000-0000-0000-000000000012', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 18, rampUp: 1, peakWeeks: [5, 6, 13, 14], lightWeeks: [0, 1, 9, 10, 18] },
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 16, rampUp: 0, peakWeeks: [3, 4, 11, 12], lightWeeks: [7, 8, 15, 16, 20] },
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 8, rampUp: 2, peakWeeks: [7, 8, 15, 16], lightWeeks: [2, 3, 10, 11] }
      ]
    },
    // Sophia Lee - Graduate Architect, learning on residential
    { 
      memberId: '00000000-0000-0000-0000-000000000013', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 32, rampUp: 4, peakWeeks: [8, 9, 10, 16, 17, 18], lightWeeks: [0, 1, 2, 3, 12, 13] }
      ]
    },
    // Daniel Wright - Senior Landscape Architect, urban design
    { 
      memberId: '00000000-0000-0000-0000-000000000014', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000004', baseHours: 28, rampUp: 2, peakWeeks: [4, 5, 6, 12, 13, 14], lightWeeks: [0, 1, 9, 10, 18, 19] },
        { projectId: '00000000-0000-0000-0001-000000000006', baseHours: 12, rampUp: 5, peakWeeks: [10, 11, 18, 19], lightWeeks: [0, 1, 2, 3, 4, 7, 8] }
      ]
    },
    // Isabella Garcia - Visualization Specialist, multiple projects
    { 
      memberId: '00000000-0000-0000-0000-000000000015', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 14, rampUp: 2, peakWeeks: [5, 6, 13, 14], lightWeeks: [1, 2, 9, 10, 17, 18] },
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 12, rampUp: 3, peakWeeks: [7, 8, 15, 16], lightWeeks: [0, 1, 4, 5, 12, 13] },
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 10, rampUp: 1, peakWeeks: [3, 4, 11, 12], lightWeeks: [6, 7, 14, 15, 19, 20] }
      ]
    },
    // Ethan Moore - Sustainability Consultant (part-time 32h), advisory role
    { 
      memberId: '00000000-0000-0000-0000-000000000016', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 10, rampUp: 1, peakWeeks: [4, 5, 12, 13], lightWeeks: [0, 1, 8, 9, 16, 17] },
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 8, rampUp: 2, peakWeeks: [6, 7, 14, 15], lightWeeks: [2, 3, 10, 11, 18, 19] },
        { projectId: '00000000-0000-0000-0001-000000000004', baseHours: 8, rampUp: 3, peakWeeks: [8, 9, 16, 17], lightWeeks: [0, 1, 4, 5, 12, 13] }
      ]
    },
    // Nathan Foster - Design Architect, commercial projects
    { 
      memberId: '00000000-0000-0000-0000-000000000017', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 24, rampUp: 2, peakWeeks: [3, 4, 11, 12], lightWeeks: [0, 1, 7, 8, 15, 16] },
        { projectId: '00000000-0000-0000-0001-000000000006', baseHours: 16, rampUp: 3, peakWeeks: [8, 9, 16, 17], lightWeeks: [2, 3, 10, 11, 19, 20] }
      ]
    },
    // Hannah Bell - Interior Architect, hospitality focus
    { 
      memberId: '00000000-0000-0000-0000-000000000018', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 28, rampUp: 1, peakWeeks: [4, 5, 12, 13], lightWeeks: [0, 8, 9, 17, 18] },
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 12, rampUp: 2, peakWeeks: [6, 7, 14, 15], lightWeeks: [2, 3, 10, 11] }
      ]
    },
    // Lucas Reed - Architectural Technician, residential documentation
    { 
      memberId: '00000000-0000-0000-0000-000000000019', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 32, rampUp: 2, peakWeeks: [5, 6, 13, 14], lightWeeks: [0, 1, 9, 10, 18, 19] }
      ]
    },
    // Grace Murphy - Project Coordinator, healthcare support
    { 
      memberId: '00000000-0000-0000-0000-000000000020', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 24, rampUp: 3, peakWeeks: [6, 7, 14, 15], lightWeeks: [0, 1, 2, 10, 11, 18] },
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 16, rampUp: 4, peakWeeks: [8, 9, 16, 17], lightWeeks: [3, 4, 12, 13, 20] }
      ]
    },
    // Owen Hayes - Senior Designer, commercial focus
    { 
      memberId: '00000000-0000-0000-0000-000000000021', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 20, rampUp: 1, peakWeeks: [4, 5, 12, 13], lightWeeks: [0, 8, 9, 16, 17] },
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 16, rampUp: 0, peakWeeks: [2, 3, 10, 11], lightWeeks: [6, 7, 14, 15, 20] }
      ]
    },
    // Chloe Brooks - Landscape Designer, urban projects
    { 
      memberId: '00000000-0000-0000-0000-000000000022', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000004', baseHours: 32, rampUp: 2, peakWeeks: [5, 6, 13, 14], lightWeeks: [0, 1, 9, 10, 18, 19] }
      ]
    },
    // Ryan Collins - BIM Specialist, multi-project support
    { 
      memberId: '00000000-0000-0000-0000-000000000023', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000001', baseHours: 16, rampUp: 1, peakWeeks: [3, 4, 11, 12], lightWeeks: [0, 7, 8, 15, 16] },
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 14, rampUp: 2, peakWeeks: [5, 6, 13, 14], lightWeeks: [1, 2, 9, 10, 17] },
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 10, rampUp: 0, peakWeeks: [7, 8, 15, 16], lightWeeks: [3, 4, 11, 12, 19] }
      ]
    },
    // Mia Stewart - Junior Designer, residential interiors
    { 
      memberId: '00000000-0000-0000-0000-000000000024', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 28, rampUp: 4, peakWeeks: [8, 9, 16, 17], lightWeeks: [0, 1, 2, 3, 12, 13] },
        { projectId: '00000000-0000-0000-0001-000000000005', baseHours: 12, rampUp: 5, peakWeeks: [10, 11, 18, 19], lightWeeks: [0, 1, 2, 3, 4, 7, 8] }
      ]
    },
    // Jack Morgan - Construction Administrator, healthcare delivery
    { 
      memberId: '00000000-0000-0000-0000-000000000025', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000003', baseHours: 36, rampUp: 0, peakWeeks: [2, 3, 10, 11, 18, 19], lightWeeks: [6, 7, 14, 15] }
      ]
    },
    // Ava Price - Design Coordinator, residential projects
    { 
      memberId: '00000000-0000-0000-0000-000000000026', 
      projects: [
        { projectId: '00000000-0000-0000-0001-000000000002', baseHours: 24, rampUp: 2, peakWeeks: [4, 5, 12, 13], lightWeeks: [0, 1, 8, 9, 17, 18] },
        { projectId: '00000000-0000-0000-0001-000000000007', baseHours: 12, rampUp: 0, peakWeeks: [6, 7, 14, 15], lightWeeks: [2, 3, 10, 11, 19, 20] }
      ]
    }
  ];

  // Generate allocations for each week in the range
  let weekIndex = 0;
  let currentWeekStart = new Date(rangeStart);
  
  while (currentWeekStart <= rangeEnd) {
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    
    memberProjectPatterns.forEach((memberPattern) => {
      memberPattern.projects.forEach((projectPattern, projIdx) => {
        // Calculate hours for this week with realistic variations
        let weeklyHours = projectPattern.baseHours;
        
        // Apply ramp-up phase (gradual increase at project start)
        if (weekIndex < projectPattern.rampUp) {
          const rampFactor = (weekIndex + 1) / projectPattern.rampUp;
          weeklyHours = Math.round(weeklyHours * rampFactor * 0.7);
        }
        
        // Apply peak weeks (deadline crunches, reviews)
        if (projectPattern.peakWeeks.includes(weekIndex)) {
          weeklyHours = Math.round(weeklyHours * 1.35);
        }
        
        // Apply light weeks (waiting for approvals, between phases)
        if (projectPattern.lightWeeks.includes(weekIndex)) {
          weeklyHours = Math.round(weeklyHours * 0.5);
        }
        
        // Add natural variance (±15-25%)
        weeklyHours = varyHours(weeklyHours, weekIndex, memberPattern.memberId, projectPattern.projectId);
        
        // Skip if no hours this week (occasional gaps)
        if (weeklyHours <= 0) return;
        
        // Distribute weekly hours across weekdays (Mon-Fri)
        for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
          const dayDate = addDays(currentWeekStart, dayOffset);
          if (dayDate > rangeEnd) break;
          
          const dateStr = format(dayDate, 'yyyy-MM-dd');
          const base = Math.floor(weeklyHours / 5);
          const remainder = weeklyHours % 5;
          const dailyHours = base + (dayOffset < remainder ? 1 : 0);
          
          if (dailyHours > 0) {
            allocations.push({
              id: `demo-alloc-${dateStr}-${memberPattern.memberId.slice(-1)}-${projIdx}`,
              company_id: DEMO_COMPANY_ID,
              project_id: projectPattern.projectId,
              resource_id: memberPattern.memberId,
              resource_type: 'active',
              allocation_date: dateStr,
              hours: dailyHours,
              stage_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      });
    });
    
    currentWeekStart = addWeeks(currentWeekStart, 1);
    weekIndex++;
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

// Demo announcements for weekly rundown
export const generateDemoAnnouncements = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  return [
    {
      id: '00000000-0000-0000-000D-000000000001',
      title: 'Q1 Planning Meeting',
      content: 'All-hands meeting Thursday at 2pm to discuss project priorities for Q1',
      created_at: format(weekStart, 'yyyy-MM-dd')
    },
    {
      id: '00000000-0000-0000-000D-000000000002',
      title: 'Office Closure Friday',
      content: 'Office will be closed this Friday for the holiday',
      created_at: format(addDays(weekStart, 1), 'yyyy-MM-dd')
    }
  ];
};

// Demo celebrations (birthdays/anniversaries for current week)
export const generateDemoCelebrations = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  
  return [
    {
      id: '00000000-0000-0000-0000-000000000003',
      first_name: 'Sarah',
      last_name: 'Wilson',
      avatar_url: null,
      type: 'birthday' as const,
      date: format(addDays(weekStart, 2), 'MMM d'),
      years: 36
    },
    {
      id: '00000000-0000-0000-0000-000000000006-anniversary',
      first_name: 'James',
      last_name: 'Taylor',
      avatar_url: null,
      type: 'anniversary' as const,
      date: format(addDays(weekStart, 4), 'MMM d'),
      years: 3
    }
  ];
};

// Demo gallery images for project photos card
export const DEMO_GALLERY_IMAGES = [
  {
    id: '00000000-0000-0000-000E-000000000001',
    file_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    file_name: 'Modern Office Building',
    file_type: 'image/jpeg'
  },
  {
    id: '00000000-0000-0000-000E-000000000002',
    file_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    file_name: 'Residential Complex',
    file_type: 'image/jpeg'
  },
  {
    id: '00000000-0000-0000-000E-000000000003',
    file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    file_name: 'Luxury Home Project',
    file_type: 'image/jpeg'
  }
];

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
  galleryImages: DEMO_GALLERY_IMAGES,
  getAllocations: generateDemoAllocations,
  getHolidays: generateDemoHolidays,
  getLeaveRequests: generateDemoLeaveRequests,
  getAnnualLeaves: generateDemoAnnualLeaves,
  getAnnouncements: generateDemoAnnouncements,
  getCelebrations: generateDemoCelebrations
};

export default DEMO_DATA;
