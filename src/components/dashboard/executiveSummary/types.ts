
import { TimeRange } from '../TimeRangeSelector';

export interface StaffMember {
  id: string;
  name: string;
  availability: number;
  weekly_capacity?: number;
}

export interface UtilizationTrends {
  days7: number;
  days30: number;
  days90: number;
}

export interface ExecutiveSummaryProps {
  activeProjects: number;
  activeResources: number;
  utilizationTrends: UtilizationTrends;
  selectedTimeRange: TimeRange;
  totalRevenue?: number;
  avgProjectValue?: number;
  staffData?: StaffMember[];
  standardizedUtilizationRate?: number;
}
