
import React from 'react';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { WorkloadHeatMapCard } from './cards/WorkloadHeatMapCard';
import { TeamCapacityStatusCard } from './cards/TeamCapacityStatusCard';
import { LeavePlanningCard } from './cards/LeavePlanningCard';
import { ProjectPipelineHealthCard } from './cards/ProjectPipelineHealthCard';
import { AnalyticsSection } from './AnalyticsSection';
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

  // Prepare analytics data for separate section - using the correct property names
  const analyticsData = {
    projectsByStatus: mockData.projectsByStatus || [],
    projectsByStage: mockData.projectsByStage || [],
    projectsByLocation: mockData.projectsByLocation || [],
    projectsByPM: mockData.projectsByPM || []
  };

  return (
    <div className="space-y-6">
      {/* First Row: Staff Status, Smart Insights, Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <UnifiedStaffStatusCard 
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
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

      {/* Second Row: New Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <div>
          <WorkloadHeatMapCard 
            data={unifiedData}
          />
        </div>
        <div>
          <TeamCapacityStatusCard 
            data={unifiedData}
          />
        </div>
        <div>
          <LeavePlanningCard 
            data={unifiedData}
          />
        </div>
        <div>
          <ProjectPipelineHealthCard 
            data={unifiedData}
          />
        </div>
      </div>
      
      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
