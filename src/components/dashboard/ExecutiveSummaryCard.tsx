
import React from 'react';
import { StandardizedExecutiveSummary } from './StandardizedExecutiveSummary';
import { getUtilizationStatus, getTimeRangeText } from './executiveSummary/utils/utilizationUtils';
import { calculateCapacityHours } from './executiveSummary/utils/capacityUtils';
import { ExecutiveSummaryProps } from './executiveSummary/types';
import { TrendingUp, Clock, Briefcase, Users } from 'lucide-react';

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

  // Calculate team composition for enhanced team size card
  const preRegisteredCount = staffData.filter(member => member.isPending).length;
  const totalTeamMembers = staffData.length;

  const metrics = [
    {
      title: "Team Size",
      value: totalTeamMembers,
      subtitle: `${activeResources} active, ${preRegisteredCount} pending`,
      badgeText: utilizationRate > 85 ? 'Consider Hiring' : 'Stable',
      badgeColor: utilizationRate > 85 ? 'orange' : 'green',
      customData: {
        activeResources,
        totalTeamMembers,
        preRegisteredCount,
        utilizationRate
      }
    },
    {
      title: "Team Utilization",
      value: `${Math.round(utilizationRate)}%`,
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
    staffDataCount: staffData.length,
    preRegisteredCount,
    totalTeamMembers
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
