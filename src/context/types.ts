/**
 * Core TypeScript interfaces for context types
 * Centralizes type definitions for better maintainability
 */

// ============================================
// Company Types
// ============================================

export interface Company {
  id: string;
  name: string;
  subdomain: string;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  industry?: string | null;
  size?: string | null;
  theme?: string | null;
  work_week_hours?: number | null;
  start_of_work_week?: string | null;
  use_hours_or_percentage?: string | null;
  allocation_warning_threshold?: number | null;
  allocation_danger_threshold?: number | null;
  allocation_max_limit?: number | null;
  opt_out_financials?: boolean | null;
  project_display_preference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  companySlug: string | null;
  refreshCompany: () => Promise<void>;
  isPathMode: boolean;
  error: string | null;
}

// ============================================
// Profile Types
// ============================================

export interface Profile {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  job_title?: string | null;
  department?: string | null;
  location?: string | null;
  practice_area?: string | null;
  weekly_capacity?: number | null;
  company_id?: string | null;
  office_role_id?: string | null;
  manager_id?: string | null;
  date_of_birth?: string | null;
  start_date?: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Project Types
// ============================================

export interface Project {
  id: string;
  code: string;
  name: string;
  abbreviation?: string | null;
  country: string;
  status: string;
  current_stage: string;
  target_profit_percentage: number;
  office_id: string;
  company_id?: string | null;
  project_manager_id?: string | null;
  department?: string | null;
  department_icon?: string | null;
  stages?: string[] | null;
  currency?: string | null;
  budget_amount?: number | null;
  budget_hours?: number | null;
  consumed_hours?: number | null;
  blended_rate?: number | null;
  average_rate?: number | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  financial_status?: string | null;
  rate_basis_strategy?: string | null;
  temp_office_location_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// ============================================
// Allocation Types
// ============================================

export interface ResourceAllocation {
  id: string;
  project_id: string;
  resource_id: string;
  resource_type: string;
  allocation_date: string;
  hours: number;
  stage_id?: string | null;
  rate_snapshot?: number | null;
  allocation_amount?: number | null;
  company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberAllocation {
  memberId: string;
  memberName: string;
  office: string;
  projectAllocations: Record<string, number>;
  totalHours: number;
  capacity: number;
  leaveHours: number;
  otherLeave: number;
  remarks: string;
}

// ============================================
// Form State Types
// ============================================

export interface StageFee {
  fee: string;
  billingMonth: string | null;
  status: string;
  invoiceDate: string | null;
  hours: string;
  invoiceAge: string;
  currency: string;
}

export interface ProjectFormState {
  code: string;
  name: string;
  abbreviation?: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  currency: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
}

// ============================================
// Manager/Dropdown Options
// ============================================

export interface ManagerOption {
  id: string;
  name: string;
}

export interface OfficeOption {
  id: string;
  city: string;
  country: string;
  code?: string;
  emoji?: string;
}

export interface StageOption {
  id: string;
  name: string;
  color?: string;
}

// ============================================
// Team Member Types
// ============================================

export interface TeamMember extends Profile {
  office_role?: {
    id: string;
    name: string;
    code: string;
  } | null;
  manager?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

// ============================================
// Weekly Rundown Types
// ============================================

export interface WeeklyMemberData {
  id: string;
  name: string;
  avatar_url?: string | null;
  job_title?: string | null;
  location?: string | null;
  office_role?: string | null;
  weekly_capacity: number;
  totalHours: number;
  leaveHours: number;
  otherLeave: number;
  projects: WeeklyProjectAllocation[];
  utilization: number;
}

export interface WeeklyProjectAllocation {
  id: string;
  allocationId?: string;
  code: string;
  name: string;
  hours: number;
  color?: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardMetrics {
  totalMembers: number;
  activeProjects: number;
  averageUtilization: number;
  totalCapacity: number;
  totalAllocated: number;
}

export interface UtilizationData {
  days7: number;
  days30: number;
  days60: number;
  days90: number;
}

// ============================================
// Leave Types
// ============================================

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  color?: string | null;
  icon?: string | null;
  is_active?: boolean | null;
  requires_attachment?: boolean | null;
  order_index?: number | null;
  company_id: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LeaveRequest {
  id: string;
  member_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  duration_type: string;
  remarks: string;
  status?: string | null;
  total_hours?: number | null;
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  company_id: string;
  created_at?: string | null;
  updated_at?: string | null;
}
