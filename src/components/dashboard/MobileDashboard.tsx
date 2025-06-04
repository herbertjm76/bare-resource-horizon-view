
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
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Smart Insights */}
        <div className="w-full">
          <MobileSmartInsights
            transformedStaffData={transformedStaffData}
            activeProjects={activeProjects}
            currentUtilizationRate={currentUtilizationRate}
          />
        </div>
        
        {/* Team Status */}
        <div className="w-full">
          <MobileTeamStatus
            transformedStaffData={transformedStaffData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Performance Gauge */}
        <div className="w-full">
          <MobilePerformanceGauge
            currentUtilizationRate={currentUtilizationRate}
          />
        </div>

        {/* Upcoming Events */}
        <div className="w-full">
          <MobileUpcomingEvents />
        </div>

        {/* Bottom padding for floating button */}
        <div className="h-20"></div>
      </div>
      
      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
