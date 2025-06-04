
import React from 'react';
import { MobileStatsOverview } from './mobile/MobileStatsOverview';
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

  // Get utilization status and color
  const getUtilizationStatus = (rate: number) => {
    if (rate >= 85) return { status: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
    if (rate >= 70) return { status: 'Optimal', color: 'bg-green-500', textColor: 'text-green-700' };
    if (rate >= 50) return { status: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Low', color: 'bg-gray-400', textColor: 'text-gray-600' };
  };

  const utilizationStatus = getUtilizationStatus(currentUtilizationRate);

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Quick Stats Overview */}
      <MobileStatsOverview
        activeResources={activeResources}
        activeProjects={activeProjects}
        currentUtilizationRate={currentUtilizationRate}
        utilizationStatus={utilizationStatus}
      />

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
  );
};
