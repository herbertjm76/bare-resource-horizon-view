
export interface WorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
  projects?: ProjectAllocation[];
}

export interface ProjectAllocation {
  project_id: string;
  project_name: string;
  project_code: string;
  hours: number;
}

export interface WeeklyWorkloadBreakdown extends WorkloadBreakdown {
  projects: ProjectAllocation[];
}

// Add the missing DailyWorkloadBreakdown type
export interface DailyWorkloadBreakdown extends WorkloadBreakdown {
  totalHours: number; // Alias for compatibility
}

// Add the missing MemberWorkloadData type
export interface MemberWorkloadData {
  daily: Record<string, DailyWorkloadBreakdown>;
}

// Add interfaces for the refactored services
export interface WeekStartDate {
  date: Date;
  key: string;
}

export interface WorkloadDataParams {
  companyId: string;
  memberIds: string[];
  startDate: Date;
  numberOfWeeks: number;
}

export interface ProcessedWorkloadResult {
  [memberId: string]: Record<string, WeeklyWorkloadBreakdown>;
}
