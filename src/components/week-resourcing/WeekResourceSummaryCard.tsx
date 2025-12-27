
import React from 'react';
import { Users, FolderKanban, Clock, TrendingUp } from 'lucide-react';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatUtilizationSummary, formatAvailableValue, formatCapacityValue } from '@/utils/allocationDisplay';

interface WeekResourceSummaryCardProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
  selectedWeek: Date;
}

export const WeekResourceSummaryCard: React.FC<WeekResourceSummaryCardProps> = ({
  projects,
  members,
  allocations,
  weekStartDate,
  selectedWeek
}) => {
  const { displayPreference } = useAppSettings();
  
  const {
    teamSummary,
    isLoading
  } = useStandardizedUtilizationData({
    selectedWeek,
    teamMembers: members || []
  });

  const totalAllocatedHours = teamSummary?.totalAllocatedHours || 
    allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
  
  const totalCapacity = teamSummary?.totalCapacity || 
    members.reduce((sum, member) => {
      const weeklyCapacity = member.weekly_capacity || 40;
      return sum + weeklyCapacity;
    }, 0);
  
  const utilizationRate = teamSummary?.teamUtilizationRate || 
    (totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0);
  
  const availableHours = teamSummary?.totalAvailableHours || 
    Math.max(0, totalCapacity - totalAllocatedHours);
  
  const activeProjects = projects.filter(project => 
    allocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0)
  ).length;
  
  const utilizationColor = UtilizationCalculationService.getUtilizationColor(utilizationRate);
  const utilizationBadgeText = UtilizationCalculationService.getUtilizationBadgeText(utilizationRate);
  const availableHoursColor = UtilizationCalculationService.getAvailableHoursColor(availableHours);
  const availableHoursBadgeText = UtilizationCalculationService.getAvailableHoursBadgeText(availableHours);

  const metrics = [
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      icon: TrendingUp,
      subtitle: formatUtilizationSummary(totalAllocatedHours, totalCapacity, displayPreference) + ' for selected week',
      badgeText: utilizationBadgeText,
      badgeColor: utilizationColor
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: FolderKanban,
      subtitle: `${projects.length} total projects`,
      badgeText: activeProjects > 0 ? 'Active' : 'None',
      badgeColor: activeProjects > 0 ? 'green' : 'red'
    },
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      subtitle: `Capacity: ${formatCapacityValue(totalCapacity, displayPreference)}`,
      badgeText: members.length > 0 ? 'Active' : 'None',
      badgeColor: members.length > 0 ? 'green' : 'red'
    },
    {
      title: "Available Hours",
      value: formatAvailableValue(availableHours, totalCapacity, displayPreference),
      icon: Clock,
      subtitle: "Remaining capacity",
      badgeText: availableHoursBadgeText,
      badgeColor: availableHoursColor
    }
  ];

  return (
    <div className="mb-6">
      <StandardizedExecutiveSummary 
        metrics={metrics}
        gradientType="purple"
      />
    </div>
  );
};
