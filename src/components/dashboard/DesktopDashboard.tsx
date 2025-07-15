
import React from 'react';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { WorkloadHeatMapCard } from './cards/WorkloadHeatMapCard';
import { TeamCapacityStatusCard } from './cards/TeamCapacityStatusCard';
import { LeavePlanningCard } from './cards/LeavePlanningCard';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';
import { TimeRange } from './TimeRangeSelector';

interface DesktopDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: Array<{
    id: string;
    name: string;
    availability: number;
    weekly_capacity?: number;
    first_name?: string;
    last_name?: string;
    role?: string;
  }>;
  mockData: any;
  selectedTimeRange: TimeRange;
  totalRevenue?: number;
  avgProjectValue?: number;
  standardizedUtilizationRate?: number;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  selectedTimeRange,
  mockData
}) => {
  // Get unified data from context
  const unifiedData = useUnifiedDashboardData();

  return (
    <div className="space-y-6">
      {/* Top Row: Team Performance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div>
          <UnifiedStaffStatusCard 
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <TeamCapacityStatusCard 
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <WorkloadHeatMapCard 
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <LeavePlanningCard 
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
      </div>

      {/* Second Row: Additional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <UnifiedSmartInsightsCard 
            data={unifiedData}
          />
        </div>
        <div>
          <UnifiedHolidayCard 
            data={unifiedData}
          />
        </div>
      </div>
    </div>
  );
};
