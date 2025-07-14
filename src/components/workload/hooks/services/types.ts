import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../types';

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

export interface WeeklyBreakdown extends WeeklyWorkloadBreakdown {}

export interface UnifiedWorkloadResult {
  [memberId: string]: {
    [weekKey: string]: WeeklyBreakdown;
  };
}