
export interface WorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export interface DailyWorkloadBreakdown extends WorkloadBreakdown {
  totalHours: number; // Alias for total for compatibility
}

export interface MemberWorkloadData {
  daily: Record<string, DailyWorkloadBreakdown>;
}
