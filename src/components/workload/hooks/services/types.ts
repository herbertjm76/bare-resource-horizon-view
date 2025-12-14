import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../types';
import type { WeekStartDay } from '@/hooks/useAppSettings';

export interface UnifiedWorkloadParams {
  companyId: string;
  members: TeamMember[];
  startDate: Date;
  numberOfWeeks: number;
  weekStartDay?: WeekStartDay;
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