
import React from 'react';
import { UnifiedSmartInsightsCard } from './cards/UnifiedSmartInsightsCard';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { TeamUtilizationGauge } from './TeamUtilizationGauge';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';
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
  selectedTimeRange = 'week'
}) => {
  // Get unified data from context
  const unifiedData = useUnifiedDashboardData();

  console.log('Mobile Dashboard - Using unified cards:', {
    selectedTimeRange,
    activeResources: unifiedData.activeResources,
    currentUtilizationRate: unifiedData.currentUtilizationRate,
    staffDataCount: unifiedData.transformedStaffData.length
  });

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Team Utilization Gauge */}
        <div className="w-full">
          <TeamUtilizationGauge
            utilizationRate={unifiedData.currentUtilizationRate}
            size="lg"
          />
        </div>

        {/* Smart Insights */}
        <div className="w-full">
          <UnifiedSmartInsightsCard
            data={unifiedData}
          />
        </div>
        
        {/* Team Status */}
        <div className="w-full">
          <UnifiedStaffStatusCard
            data={unifiedData}
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Upcoming Events */}
        <div className="w-full">
          <UnifiedHolidayCard 
            data={unifiedData}
          />
        </div>

        {/* Bottom padding for floating button */}
        <div className="h-20"></div>
      </div>
      
      {/* Floating Herbie Button */}
      <HerbieFloatingButton />
    </div>
  );
};
