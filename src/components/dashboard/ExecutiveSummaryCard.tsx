
import React from 'react';
import { SummaryHeader } from './executiveSummary/components/SummaryHeader';
import { UtilizationCard } from './executiveSummary/components/UtilizationCard';
import { CapacityCard } from './executiveSummary/components/CapacityCard';
import { ProjectsCard } from './executiveSummary/components/ProjectsCard';
import { TeamSizeCard } from './executiveSummary/components/TeamSizeCard';
import { getUtilizationStatus, getTimeRangeText } from './executiveSummary/utils/utilizationUtils';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { ExecutiveSummaryProps } from './executiveSummary/types';

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryProps> = ({
  activeProjects,
  activeResources,
  utilizationTrends,
  selectedTimeRange,
  totalRevenue = 0,
  avgProjectValue = 0,
  staffData = [],
  standardizedUtilizationRate
}) => {
  // Use standardized utilization rate if provided, otherwise fall back to legacy calculation
  const utilizationRate = standardizedUtilizationRate !== undefined 
    ? standardizedUtilizationRate 
    : (() => {
        // Legacy fallback calculation
        switch (selectedTimeRange) {
          case 'week': return utilizationTrends.days7;
          case 'month': return utilizationTrends.days30;
          case '3months': 
          case '4months':
          case '6months':
          case 'year':
            return utilizationTrends.days90;
          default: return utilizationTrends.days30;
        }
      })();

  const utilizationStatus = getUtilizationStatus(utilizationRate);
  const timeRangeText = getTimeRangeText(selectedTimeRange);
  const capacityHours = calculateCapacityHours(selectedTimeRange, activeResources, utilizationRate, staffData);
  const isOverCapacity = capacityHours < 0;

  console.log('Executive Summary Card Data (Standardized):', {
    selectedTimeRange,
    activeProjects,
    activeResources,
    utilizationRate,
    standardizedUtilizationRate,
    totalRevenue,
    avgProjectValue,
    capacityHours,
    isOverCapacity,
    staffDataCount: staffData.length
  });

  return (
    <div 
      className="rounded-2xl p-4 border border-brand-violet/10"
      style={{
        background: 'linear-gradient(45deg, #6F4BF6 0%, #5669F7 55%, #E64FC4 100%)'
      }}
    >
      <SummaryHeader timeRangeText={timeRangeText} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <UtilizationCard 
          utilizationRate={utilizationRate}
          utilizationStatus={utilizationStatus}
        />

        <CapacityCard 
          capacityHours={capacityHours}
          isOverCapacity={isOverCapacity}
          timeRangeText={timeRangeText}
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
