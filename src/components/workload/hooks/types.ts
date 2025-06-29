
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
