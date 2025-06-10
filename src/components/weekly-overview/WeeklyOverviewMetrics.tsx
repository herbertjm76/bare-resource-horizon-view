
import React from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { useWeekResourceData } from '../week-resourcing/hooks/useWeekResourceData';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';
import { startOfWeek, format } from 'date-fns';

interface WeeklyOverviewMetricsProps {
  selectedWeek: Date;
}

export const useWeeklyOverviewMetrics = ({ selectedWeek }: WeeklyOverviewMetricsProps) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartDate = format(weekStart, 'yyyy-MM-dd');
  
  const {
    projects,
    members,
    allocations,
    isLoading: isLoadingResourceData,
    error
  } = useWeekResourceData(weekStartDate, { office: "all", searchTerm: "" });

  const {
    teamSummary,
    isLoading: isLoadingUtilization
  } = useStandardizedUtilizationData({
    selectedWeek,
    teamMembers: members || []
  });

  const isLoading = isLoadingResourceData || isLoadingUtilization;

  // Count active projects for the week
  const activeProjectsCount = projects?.filter(project => {
    return allocations?.some(allocation => allocation.project_id === project.id && allocation.hours > 0);
  }).length || 0;

  // Use standardized calculations if available, otherwise fallback
  const utilizationRate = teamSummary?.teamUtilizationRate || 0;
  const totalAllocatedHours = teamSummary?.totalAllocatedHours || 0;
  const availableHours = teamSummary?.totalAvailableHours || 0;
  const totalCapacity = teamSummary?.totalCapacity || 0;

  const metrics = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
      icon: TrendingUp,
      subtitle: `${activeProjectsCount} active this week`,
      isGood: activeProjectsCount > 0
    },
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      icon: Clock,
      subtitle: `${totalAllocatedHours}h allocated`,
      badgeText: UtilizationCalculationService.getUtilizationBadgeText(utilizationRate),
      badgeColor: UtilizationCalculationService.getUtilizationColor(utilizationRate),
      isGood: utilizationRate >= 70 && utilizationRate <= 85
    },
    {
      title: "Team Members",
      value: members?.length || 0,
      icon: Users,
      subtitle: `${totalCapacity}h capacity`,
      isGood: (members?.length || 0) > 0
    },
    {
      title: "Available Hours",
      value: `${availableHours}h`,
      icon: CheckCircle,
      subtitle: "This week",
      badgeText: UtilizationCalculationService.getAvailableHoursBadgeText(availableHours),
      badgeColor: UtilizationCalculationService.getAvailableHoursColor(availableHours),
      isGood: availableHours > 0
    }
  ];

  console.log('WeeklyOverviewMetrics - Final metrics:', {
    metricsCount: metrics.length,
    utilizationRate,
    totalAllocatedHours,
    availableHours,
    totalCapacity,
    activeProjectsCount
  });

  return {
    metrics,
    isLoading,
    error
  };
};
