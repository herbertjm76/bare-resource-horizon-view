
import React from 'react';
import { TeamUtilizationCard } from './kpi/TeamUtilizationCard';
import { OverCapacityCard } from './kpi/OverCapacityCard';
import { ActiveProjectsCard } from './kpi/ActiveProjectsCard';
import { TeamSizeCard } from './kpi/TeamSizeCard';
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

  // Calculate over capacity hours (simplified calculation)
  const overCapacityHours = Math.max(0, Math.round((unifiedData.currentUtilizationRate - 100) * unifiedData.totalTeamSize * 40 / 100));

  return (
    <div className="space-y-6">
      {/* First Row: New KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TeamUtilizationCard 
          utilizationRate={unifiedData.currentUtilizationRate}
          status={unifiedData.utilizationStatus}
        />
        <OverCapacityCard 
          overCapacityHours={overCapacityHours}
        />
        <ActiveProjectsCard 
          activeProjects={unifiedData.activeProjects}
          totalTeamSize={unifiedData.totalTeamSize}
        />
        <TeamSizeCard 
          totalTeamSize={unifiedData.totalTeamSize}
          activeResources={unifiedData.activeResources}
        />
      </div>


      
      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
