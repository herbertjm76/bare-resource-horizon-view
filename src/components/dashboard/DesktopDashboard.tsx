
import React from 'react';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { IntelligentInsights } from './IntelligentInsights';
import { HolidayCard } from './HolidayCard';
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

  // Prepare analytics data for separate section
  const analyticsData = {
    projectsByStatus: mockData.projectsByStatus || [],
    projectsByStage: mockData.projectsByStage || [],
    projectsByRegion: mockData.projectsByRegion || [],
    projectsByPM: mockData.projectsByPM || []
  };

  return (
    <div className="space-y-6">
      {/* Main Row: Staff Status, Smart Insights, Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <StaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <IntelligentInsights 
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={standardizedUtilizationRate || 0}
          />
        </div>
        <div>
          <HolidayCard />
        </div>
      </div>
      
      {/* Analytics Charts - Project Status, Project Stages, Regional Distribution, Projects by PM */}
      <AnalyticsSection mockData={analyticsData} />
    </div>
  );
};
