
import React from 'react';
import { StandardizedExecutiveSummary } from './StandardizedExecutiveSummary';
import { getUtilizationStatus, getTimeRangeText } from './executiveSummary/utils/utilizationUtils';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { ExecutiveSummaryProps } from './executiveSummary/types';
import { Gauge } from './Gauge';

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
            return utilizationTrends.days90;
          default: return utilizationTrends.days30;
        }
      })();

  const utilizationStatus = getUtilizationStatus(utilizationRate);
  const timeRangeText = getTimeRangeText(selectedTimeRange);
  const capacityHours = calculateCapacityHours(selectedTimeRange, activeResources, utilizationRate, staffData);
  const isOverCapacity = capacityHours < 0;

  // Simplified metrics without AI
  const metrics = [
    {
      title: "Team Utilization",
      value: (
        <div className="flex flex-col items-center space-y-1">
          <Gauge
            value={utilizationRate}
            max={100}
            title=""
            size="sm"
            showPercentage={false}
            thresholds={{ good: 70, warning: 85, critical: 95 }}
          />
          <span className="text-lg font-bold">{Math.round(utilizationRate)}%</span>
        </div>
      ),
      subtitle: timeRangeText,
      badgeText: utilizationStatus.label,
      badgeColor: utilizationStatus.color === 'destructive' ? 'red' : 
                  utilizationStatus.color === 'default' ? 'green' : 'blue'
    },
    {
      title: isOverCapacity ? "Over Capacity" : "Available Capacity",
      value: `${Math.abs(capacityHours).toLocaleString()}h`,
      subtitle: timeRangeText,
      badgeText: isOverCapacity ? "Over Capacity" : undefined,
      badgeColor: isOverCapacity ? "red" : undefined
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: activeResources > 0 
        ? `${(activeProjects / activeResources).toFixed(1)} per person` 
        : 'No team members'
    },
    {
      title: "Team Size",
      value: activeResources,
      subtitle: "Active resources",
      badgeText: utilizationRate > 85 ? 'Consider Hiring' : 'Stable',
      badgeColor: utilizationRate > 85 ? 'orange' : 'green'
    }
  ];

  console.log('Executive Summary Card - Final State:', {
    selectedTimeRange,
    activeProjects,
    activeResources,
    utilizationRate,
    standardizedUtilizationRate,
    capacityHours,
    isOverCapacity,
    staffDataCount: staffData.length
  });

  return (
    <StandardizedExecutiveSummary
      title="Executive Summary"
      timeRangeText={timeRangeText}
      metrics={metrics}
      badgePosition="title"
    />
  );
};
