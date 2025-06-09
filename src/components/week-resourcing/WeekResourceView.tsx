
import React from 'react';
import { ResourceTableLoadingState } from '@/components/weekly-overview/components/ResourceTableLoadingState';
import { ResourceTableErrorState } from '@/components/weekly-overview/components/ResourceTableErrorState';
import { EmptyResourceState } from '@/components/weekly-overview/components/EmptyResourceState';
import { NewResourceTable } from '@/components/week-resourcing/NewResourceTable';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { WeekResourceControls } from '@/components/week-resourcing/WeekResourceControls';
import { useWeekResourceData } from './hooks/useWeekResourceData';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import './week-resourcing.css';

interface WeekResourceViewProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm?: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const {
    projects,
    members,
    weekAllocations,
    annualLeaveData,
    holidaysData,
    weekStartDate,
    isLoading,
    error
  } = useWeekResourceData({ selectedWeek, filters });

  // Use standardized utilization data
  const {
    teamSummary,
    isLoading: isLoadingUtilization
  } = useStandardizedUtilizationData({
    selectedWeek,
    teamMembers: members || []
  });
  
  // Render loading state
  if (isLoading || isLoadingUtilization) {
    return <ResourceTableLoadingState />;
  }
  
  // Render error state
  if (error) {
    return <ResourceTableErrorState error={error} />;
  }
  
  // Render empty state
  if (!projects || projects.length === 0) {
    return <EmptyResourceState />;
  }

  // Calculate summary metrics using standardized service
  const totalAllocatedHours = teamSummary?.totalAllocatedHours || 
    weekAllocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
  
  const totalCapacity = teamSummary?.totalCapacity || 
    members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
  
  const utilizationRate = teamSummary?.teamUtilizationRate || 
    (totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0);
  
  const availableHours = teamSummary?.totalAvailableHours || 
    Math.max(0, totalCapacity - totalAllocatedHours);
  
  // Count active projects (projects with allocations)
  const activeProjects = projects.filter(project => 
    weekAllocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0)
  ).length;

  // Create metrics for StandardizedExecutiveSummary
  const metrics = [
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      subtitle: `${totalAllocatedHours}h of ${totalCapacity}h`,
      badgeText: UtilizationCalculationService.getUtilizationBadgeText(utilizationRate),
      badgeColor: UtilizationCalculationService.getUtilizationColor(utilizationRate),
      icon: TrendingUp
    },
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: `${projects.length} total projects`,
      badgeText: "Active",
      badgeColor: "green",
      icon: Calendar
    },
    {
      title: "Team Members",
      value: members.length,
      subtitle: `${totalCapacity}h total capacity`,
      badgeText: "Stable",
      badgeColor: "green",
      icon: Users
    },
    {
      title: "Available Hours",
      value: `${availableHours}h`,
      subtitle: "Remaining capacity",
      badgeText: UtilizationCalculationService.getAvailableHoursBadgeText(availableHours),
      badgeColor: UtilizationCalculationService.getAvailableHoursColor(availableHours),
      icon: Clock
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card - moved to top */}
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="blue"
      />
      
      {/* Controls/Filters */}
      <WeekResourceControls
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weekLabel={weekLabel}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      
      {/* Resource Table */}
      <NewResourceTable 
        projects={projects}
        members={members}
        allocations={weekAllocations}
        annualLeaveData={annualLeaveData}
        holidaysData={holidaysData}
        weekStartDate={weekStartDate}
      />
    </div>
  );
};
