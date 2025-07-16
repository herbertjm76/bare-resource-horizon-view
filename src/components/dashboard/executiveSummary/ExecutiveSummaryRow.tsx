import React from 'react';
import { SummaryHeader } from './components/SummaryHeader';
import { TeamUtilizationCard } from './components/TeamUtilizationCard';
import { CapacityCard } from './components/CapacityCard';
import { ProjectsCard } from './components/ProjectsCard';
import { TeamSizeCard } from './components/TeamSizeCard';
import { useUnifiedDashboardData } from '../UnifiedDashboardProvider';
import { TimeRange } from '../TimeRangeSelector';

interface ExecutiveSummaryRowProps {
  selectedTimeRange: TimeRange;
}

export const ExecutiveSummaryRow: React.FC<ExecutiveSummaryRowProps> = ({
  selectedTimeRange
}) => {
  const unifiedData = useUnifiedDashboardData();

  // Calculate utilization rate
  const utilizationRate = unifiedData.currentUtilizationRate || 0;
  
  // Calculate capacity hours (simplified calculation)
  const totalCapacity = unifiedData.teamMembers?.reduce((sum, member) => 
    sum + (member.weekly_capacity || 40), 0) || 0;
  const weeksInPeriod = selectedTimeRange === 'week' ? 1 : 
                       selectedTimeRange === 'month' ? 4 : 
                       selectedTimeRange === '3months' ? 12 :
                       selectedTimeRange === '4months' ? 16 :
                       selectedTimeRange === '6months' ? 24 : 52;
  const capacityHours = totalCapacity * weeksInPeriod;
  
  // Determine if over capacity
  const isOverCapacity = utilizationRate > 100;
  const overCapacityHours = isOverCapacity ? capacityHours * (utilizationRate - 100) / 100 : 0;

  // Get time range text
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return '3 Months';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  // Calculate utilization status
  const getUtilizationStatus = () => {
    if (utilizationRate >= 150) return { color: 'bg-red-500/20', label: 'Critical' };
    if (utilizationRate >= 100) return { color: 'bg-orange-500/20', label: 'Over Capacity' };
    if (utilizationRate >= 80) return { color: 'bg-yellow-500/20', label: 'High' };
    return { color: 'bg-green-500/20', label: 'Optimal' };
  };

  return (
    <div className="space-y-6">
      <SummaryHeader timeRangeText={getTimeRangeText()} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TeamUtilizationCard 
          utilizationRate={utilizationRate}
          utilizationStatus={getUtilizationStatus()}
        />
        
        <CapacityCard 
          capacityHours={isOverCapacity ? overCapacityHours : capacityHours}
          isOverCapacity={isOverCapacity}
          timeRangeText={getTimeRangeText()}
        />
        
        <ProjectsCard 
          activeProjects={unifiedData.activeProjects || 0}
          activeResources={unifiedData.activeResources || 0}
        />
        
        <TeamSizeCard 
          activeResources={unifiedData.activeResources || 0}
          utilizationRate={utilizationRate}
        />
      </div>
    </div>
  );
};