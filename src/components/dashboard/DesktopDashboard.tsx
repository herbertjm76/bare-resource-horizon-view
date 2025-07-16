
import React from 'react';
import { TeamUtilizationCard } from './cards/TeamUtilizationCard';
import { WorkloadCard } from './cards/WorkloadCard';
import { TeamLeaveCard } from './cards/TeamLeaveCard';
import { ProjectPipelineCard } from './cards/ProjectPipelineCard';
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
      {/* First Row: New Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeamUtilizationCard 
          utilizationRate={unifiedData.currentUtilizationRate} 
          utilizationStatus={unifiedData.utilizationStatus}
        />
        <WorkloadCard 
          projects={unifiedData.projects}
          teamMembers={unifiedData.teamMembers}
          memberUtilizations={unifiedData.memberUtilizations}
        />
        <TeamLeaveCard 
          teamMembers={unifiedData.teamMembers}
          memberUtilizations={unifiedData.memberUtilizations}
        />
        <ProjectPipelineCard 
          projects={unifiedData.projects}
        />
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
