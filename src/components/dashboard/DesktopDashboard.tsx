
import React from 'react';
import { TeamUtilizationKPI } from './kpi/TeamUtilizationKPI';
import { OverCapacityKPI } from './kpi/OverCapacityKPI';
import { ActiveProjectsKPI } from './kpi/ActiveProjectsKPI';
import { TeamSizeKPI } from './kpi/TeamSizeKPI';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
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
  mockData,
  activeProjects,
  activeResources
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
      {/* First Row: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeamUtilizationKPI utilizationRate={165} />
        <OverCapacityKPI overCapacityHours={624} />
        <ActiveProjectsKPI activeProjects={activeProjects} activeResources={activeResources} />
        <TeamSizeKPI teamSize={activeResources} recommendHiring={true} />
      </div>

      {/* Second Row: The 3 Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UnifiedStaffStatusCard 
          data={unifiedData}
          selectedTimeRange={selectedTimeRange}
        />
        <UnifiedSmartInsightsCard 
          data={unifiedData}
        />
        <UnifiedHolidayCard 
          data={unifiedData}
        />
      </div>

      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
