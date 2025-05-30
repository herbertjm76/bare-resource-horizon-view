
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

  // Calculate breakdown data
  const optimalTeamMembers = Math.round(activeResources * 0.7);
  const overutilizedMembers = Math.round(activeResources * 0.2);
  const underutilizedMembers = activeResources - optimalTeamMembers - overutilizedMembers;

  const inProgressProjects = Math.round(activeProjects * 0.6);
  const planningProjects = Math.round(activeProjects * 0.3);
  const completedProjects = activeProjects - inProgressProjects - planningProjects;

  const metrics = [
    {
      title: "Team Utilization",
      value: `${Math.round(utilizationRate)}%`,
      icon: TrendingUp,
      badgeText: utilizationStatus.label,
      badgeColor: utilizationStatus.color === 'destructive' ? 'red' : 
                 utilizationStatus.color === 'default' ? 'green' : 'blue',
      isGood: utilizationRate >= 70 && utilizationRate <= 85,
      breakdowns: [
        { label: 'Optimal', value: optimalTeamMembers, color: 'green' },
        { label: 'Over', value: overutilizedMembers, color: 'red' },
        { label: 'Under', value: underutilizedMembers, color: 'orange' }
      ]
    },
    {
      title: isOverCapacity ? "Over Capacity" : "Available Capacity",
      value: `${Math.abs(capacityHours).toLocaleString()}h`,
      subtitle: timeRangeText,
      icon: Clock,
      badgeText: isOverCapacity ? "Over Capacity" : undefined,
      badgeColor: isOverCapacity ? "red" : undefined,
      isGood: !isOverCapacity,
      breakdowns: [
        { label: 'Used', value: `${Math.round(utilizationRate)}%`, color: 'blue' },
        { label: 'Available', value: `${100 - Math.round(utilizationRate)}%`, color: 'green' }
      ]
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: activeResources > 0 
        ? `${(activeProjects / activeResources).toFixed(1)} per person` 
        : 'No team members',
      icon: Briefcase,
      isGood: activeResources > 0 ? (activeProjects / activeResources) <= 3 : undefined,
      breakdowns: [
        { label: 'In Progress', value: inProgressProjects, color: 'blue' },
        { label: 'Planning', value: planningProjects, color: 'orange' },
        { label: 'Completed', value: completedProjects, color: 'green' }
      ]
    },
    {
      title: "Team Size",
      value: activeResources,
      icon: Users,
      badgeText: utilizationRate > 85 ? 'Consider Hiring' : 'Stable',
      badgeColor: utilizationRate > 85 ? 'orange' : 'green',
      isGood: activeResources > 0,
      breakdowns: [
        { label: 'Senior', value: Math.round(activeResources * 0.4), color: 'green' },
        { label: 'Mid-level', value: Math.round(activeResources * 0.4), color: 'blue' },
        { label: 'Junior', value: Math.round(activeResources * 0.2), color: 'orange' }
      ]
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
      cardFormat="detailed"
    />
  );
};
