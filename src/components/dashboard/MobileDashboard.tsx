
import React from 'react';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
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

  console.log('Mobile Dashboard - Using unified cards:', {
    selectedTimeRange,
    activeResources,
    currentUtilizationRate,
    staffDataCount: staffData.length
  });

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Smart Insights */}
        <div className="w-full">
          <UnifiedSmartInsightsCard
            teamMembers={transformedStaffData}
            activeProjects={activeProjects}
            utilizationRate={currentUtilizationRate}
          />
        </div>
        
        {/* Team Status */}
        <div className="w-full">
          <UnifiedStaffStatusCard
            staffData={transformedStaffData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Upcoming Events */}
        <div className="w-full">
          <UnifiedHolidayCard />
        </div>

        {/* Bottom padding for floating button */}
        <div className="h-20"></div>
      </div>
      
      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
