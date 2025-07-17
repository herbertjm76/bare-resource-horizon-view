
import React from 'react';
import { TeamUtilizationCard } from './cards/TeamUtilizationCard';
import { WorkloadCard } from './cards/WorkloadCard';
import { TeamLeaveCard } from './cards/TeamLeaveCard';
import { ProjectPipelineCard } from './cards/ProjectPipelineCard';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { AnalyticsSection } from './AnalyticsSection';
import { LoadingDashboard } from './LoadingDashboard';
import { useDashboardData } from './hooks/useDashboardData';
import { TimeRange } from './TimeRangeSelector';

interface DesktopDashboardProps {
  selectedTimeRange: TimeRange;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  selectedTimeRange
}) => {
  // Use unified dashboard data to ensure consistency
  const data = useDashboardData(selectedTimeRange);
  
  // Debug logging for Paul Julius utilization data
  const paulData = data.memberUtilizations?.find(m => 
    m.memberName?.includes('Paul') || m.memberName?.includes('Julius')
  );
  
  if (paulData) {
    console.log('🔍 DESKTOP DASHBOARD - Paul Julius data:', {
      memberName: paulData.memberName,
      utilization: paulData.utilization,
      memberId: paulData.memberId,
      source: 'dashboard memberUtilizations'
    });
  }

  // Show loading state while core data is loading
  if (data.isLoading) {
    return <LoadingDashboard />;
  }

  // Prepare analytics data for separate section - using the correct property names
  const analyticsData = {
    projectsByStatus: data.mockData?.projectsByStatus || [],
    projectsByStage: data.mockData?.projectsByStage || [],
    projectsByLocation: data.mockData?.projectsByLocation || [],
    projectsByPM: data.mockData?.projectsByPM || []
  };

  return (
    <div className="space-y-6">
      {/* First Row: New Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeamUtilizationCard 
          utilizationRate={data.currentUtilizationRate} 
          utilizationStatus={data.utilizationStatus}
        />
        <WorkloadCard 
          projects={data.projects}
          teamMembers={data.teamMembers}
          preRegisteredMembers={data.preRegisteredMembers}
          memberUtilizations={data.memberUtilizations}
          selectedTimeRange={selectedTimeRange}
        />
        <TeamLeaveCard 
          teamMembers={data.teamMembers}
          memberUtilizations={data.memberUtilizations}
          viewType={selectedTimeRange === 'week' ? 'week' : selectedTimeRange === '3months' ? 'quarter' : 'month'}
        />
        <ProjectPipelineCard 
          projects={data.projects}
        />
      </div>

      {/* Second Row: The 3 Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UnifiedStaffStatusCard 
          data={data}
          selectedTimeRange={selectedTimeRange}
        />
        <UnifiedSmartInsightsCard 
          data={data}
        />
        <UnifiedHolidayCard 
          data={data}
        />
      </div>

      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
