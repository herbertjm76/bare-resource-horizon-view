
import React from 'react';
import { MobileSmartInsights } from './mobile/MobileSmartInsights';
import { MobileTeamStatus } from './mobile/MobileTeamStatus';
import { MobilePerformanceGauge } from './mobile/MobilePerformanceGauge';
import { MobileUpcomingEvents } from './mobile/MobileUpcomingEvents';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { TimeRange } from './TimeRangeSelector';

interface MobileDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: any[];
  mockData: any;
  selectedTimeRange?: TimeRange;
  standardizedUtilizationRate?: number;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData,
  selectedTimeRange = 'week',
  standardizedUtilizationRate
}) => {
  // Use standardized utilization rate if available, otherwise fall back to trends
  const currentUtilizationRate = standardizedUtilizationRate !== undefined 
    ? standardizedUtilizationRate 
    : utilizationTrends.days7;

  // Transform staffData to match StaffMember interface
  const transformedStaffData = staffData.map(member => ({
    ...member,
    first_name: member.first_name || member.name.split(' ')[0] || '',
    last_name: member.last_name || member.name.split(' ').slice(1).join(' ') || '',
    role: member.role || 'Member'
  }));

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-4 p-4 pb-20 w-full max-w-full">
        {/* Smart Insights */}
        <MobileSmartInsights
          transformedStaffData={transformedStaffData}
          activeProjects={activeProjects}
          currentUtilizationRate={currentUtilizationRate}
        />
        
        {/* Team Status */}
        <MobileTeamStatus
          transformedStaffData={transformedStaffData}
          selectedTimeRange={selectedTimeRange}
        />

        {/* Performance Gauge - Simplified */}
        <MobilePerformanceGauge
          currentUtilizationRate={currentUtilizationRate}
        />

        {/* Upcoming Events */}
        <MobileUpcomingEvents />

        {/* Floating Herbie Button */}
        <HerbieFloatingButton />
      </div>
    </div>
  );
};
