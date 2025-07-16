import React from 'react';
import { SummaryHeader } from './components/SummaryHeader';
import { TeamUtilizationCard } from './components/TeamUtilizationCard';
import { OverCapacityCard } from './components/OverCapacityCard';
import { ProjectsCard } from './components/ProjectsCard';
import { TeamSizeCard } from './components/TeamSizeCard';
import { ExecutiveSummaryProps } from './types';

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends,
  selectedTimeRange,
  totalRevenue,
  avgProjectValue,
  staffData,
  standardizedUtilizationRate
}) => {
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case '3months':
        return 'This Quarter';
      default:
        return 'This Month';
    }
  };

  const utilizationRate = standardizedUtilizationRate || 165;
  const utilizationStatus = {
    color: utilizationRate > 100 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400',
    label: utilizationRate > 100 ? 'Critical' : 'Optimal'
  };

  return (
    <div className="space-y-6">
      <SummaryHeader timeRangeText={getTimeRangeText()} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TeamUtilizationCard 
          utilizationRate={utilizationRate}
          utilizationStatus={utilizationStatus}
        />
        <OverCapacityCard 
          overCapacityHours={624}
          timeRange="This Month"
        />
        <ProjectsCard 
          activeProjects={activeProjects}
          activeResources={activeResources}
        />
        <TeamSizeCard 
          activeResources={activeResources}
          utilizationRate={utilizationRate}
        />
      </div>
    </div>
  );
};