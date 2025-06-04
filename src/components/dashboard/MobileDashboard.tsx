
import React from 'react';
import { MobileSmartInsights } from './mobile/MobileSmartInsights';
import { MobileTeamStatus } from './mobile/MobileTeamStatus';
import { MobilePerformanceGauge } from './mobile/MobilePerformanceGauge';
import { MobileUpcomingEvents } from './mobile/MobileUpcomingEvents';
import { MobileSummaryCards } from './mobile/MobileSummaryCards';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { TimeRange } from './TimeRangeSelector';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { getTimeRangeText } from './executiveSummary/utils/utilizationUtils';

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

  // Use the same capacity calculation as the desktop version
  const timeRangeText = getTimeRangeText(selectedTimeRange);
  const capacityHours = calculateCapacityHours(selectedTimeRange, activeResources, currentUtilizationRate, staffData);
  const isOverCapacity = capacityHours < 0;

  console.log('Mobile Dashboard - Capacity Calculation:', {
    selectedTimeRange,
    activeResources,
    currentUtilizationRate,
    staffDataCount: staffData.length,
    capacityHours,
    isOverCapacity,
    timeRangeText
  });

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="w-full">
          <MobileSummaryCards
            activeResources={activeResources}
            activeProjects={activeProjects}
            utilizationRate={currentUtilizationRate}
            capacityHours={Math.abs(capacityHours)}
            isOverCapacity={isOverCapacity}
            timeRangeText={timeRangeText}
          />
        </div>

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
