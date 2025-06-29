
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
