import { TeamMember } from '@/components/dashboard/types';

export interface UnifiedWorkloadParams {
  companyId: string;
  members: TeamMember[];
  startDate: Date;
  numberOfWeeks: number;
}

export interface ProjectAllocation {
  resource_id: string;
  project_id: string;
  week_start_date: string;
  hours: number;
  resource_type: string;
  projects: {
    id: string;
    name: string;
    code: string;
  };
}

export interface WeeklyBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
  projects: Array<{
    project_id: string;
    project_name: string;
    project_code: string;
    hours: number;
  }>;
}

export interface UnifiedWorkloadResult {
  [memberId: string]: {
    [weekKey: string]: WeeklyBreakdown;
  };
}