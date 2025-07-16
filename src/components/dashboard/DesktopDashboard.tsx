
import React from 'react';
import { TeamUtilizationCard } from './cards/TeamUtilizationCard';
import { WorkloadCapacityCard } from './cards/WorkloadCapacityCard';
import { TeamLeaveCard } from './cards/TeamLeaveCard';
import { ProjectPipelineCard } from './cards/ProjectPipelineCard';
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
      {/* KPI Cards Row: Team Utilization, Workload Capacity, Team Leave, Project Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <TeamUtilizationCard 
          data={unifiedData}
          selectedTimeRange={selectedTimeRange}
        />
        <WorkloadCapacityCard 
          data={unifiedData}
          selectedTimeRange={selectedTimeRange}
        />
        <TeamLeaveCard 
          data={unifiedData}
          selectedTimeRange={selectedTimeRange}
        />
        <ProjectPipelineCard 
          data={unifiedData}
        />
      </div>


      
      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
