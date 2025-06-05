
import React from 'react';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { AnalyticsSection } from './AnalyticsSection';
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
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData,
  selectedTimeRange,
  totalRevenue,
  avgProjectValue,
  standardizedUtilizationRate
}) => {
  // Transform staffData to match StaffMember interface
  const transformedStaffData = staffData.map(member => ({
    ...member,
    first_name: member.first_name || member.name.split(' ')[0] || '',
    last_name: member.last_name || member.name.split(' ').slice(1).join(' ') || '',
    role: member.role || 'Member'
  }));

  // Prepare analytics data for separate section - using the correct property names
  const analyticsData = {
    projectsByStatus: mockData.projectsByStatus || [],
    projectsByStage: mockData.projectsByStage || [],
    projectsByLocation: mockData.projectsByLocation || [],
    projectsByPM: mockData.projectsByPM || []
  };

  return (
    <div className="space-y-6">
      {/* Main Row: Staff Status, Smart Insights, Upcoming Holidays - Using mobile-style cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <UnifiedStaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <UnifiedSmartInsightsCard 
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={standardizedUtilizationRate || 0}
          />
        </div>
        <div>
          <UnifiedHolidayCard />
        </div>
      </div>
      
      {/* Analytics Charts - Project Status, Project Stages, Project Locations, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
