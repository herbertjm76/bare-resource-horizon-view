
import { TeamMember } from '@/components/dashboard/types';

export interface WeeklyWorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export interface WeekStartDate {
  date: Date;
  key: string;
}

export interface WorkloadDataResult {
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  isLoadingWorkload: boolean;
  weekStartDates: WeekStartDate[];
}

export interface ProcessedWorkloadData {
  [memberId: string]: {
    [weekKey: string]: WeeklyWorkloadBreakdown;
  };
}
