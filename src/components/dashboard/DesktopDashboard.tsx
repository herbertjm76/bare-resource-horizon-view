
import React from 'react';
import { ExecutiveSummaryRow } from './executiveSummary/ExecutiveSummaryRow';
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
      {/* Executive Summary KPI Cards */}
      <ExecutiveSummaryRow selectedTimeRange={selectedTimeRange} />
      
      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
