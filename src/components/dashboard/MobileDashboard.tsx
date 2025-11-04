
import React from 'react';
import { UnifiedStaffStatusCard } from './cards/UnifiedStaffStatusCard';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { WorkloadHeatMapCard } from './cards/WorkloadHeatMapCard';
import { TeamCapacityStatusCard } from './cards/TeamCapacityStatusCard';
import { LeavePlanningCard } from './cards/LeavePlanningCard';
import { ProjectPipelineHealthCard } from './cards/ProjectPipelineHealthCard';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';
import { TimeRange } from './TimeRangeSelector';

interface MobileDashboardProps {
  selectedTimeRange: TimeRange;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  selectedTimeRange
}) => {
  // Use unified dashboard data to ensure consistency
  const data = useUnifiedDashboardData();
  
  // Debug logging for Paul Julius utilization data
  const paulData = data.memberUtilizations?.find(m => 
    m.memberName?.includes('Paul') || m.memberName?.includes('Julius')
  );
  
  if (paulData) {
    console.log('🔍 MOBILE DASHBOARD - Paul Julius data:', {
      memberName: paulData.memberName,
      utilizationRate: paulData.utilizationRate,
      memberId: paulData.memberId,
      source: 'standardized memberUtilizations'
    });
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Team Status */}
        <div className="w-full">
          <UnifiedStaffStatusCard
            data={data}
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Upcoming Events */}
        <div className="w-full">
          <UnifiedHolidayCard 
            data={data}
          />
        </div>

        {/* New Dashboard Cards */}
        <div className="w-full">
          <WorkloadHeatMapCard 
            data={data}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        
        <div className="w-full">
          <TeamCapacityStatusCard 
            data={data}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        
        <div className="w-full">
          <LeavePlanningCard 
            data={data}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        
        <div className="w-full">
          <ProjectPipelineHealthCard 
            data={data}
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
