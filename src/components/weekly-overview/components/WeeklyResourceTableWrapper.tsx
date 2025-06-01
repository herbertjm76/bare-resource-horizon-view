
import React, { useEffect } from 'react';
import { EnhancedWeeklyResourceTable } from './EnhancedWeeklyResourceTable';
import { ResourceTableLoadingState } from './ResourceTableLoadingState';
import { ResourceTableErrorState } from './ResourceTableErrorState';
import { EmptyResourceState } from './EmptyResourceState';
import { useWeeklyResourceData } from '../hooks/useWeeklyResourceData';
import { format, startOfWeek, addDays } from 'date-fns';

interface WeeklyResourceTableWrapperProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTableWrapper: React.FC<WeeklyResourceTableWrapperProps> = ({
  selectedWeek,
  filters
}) => {
  // Extend filters to match the expected interface
  const extendedFilters = {
    office: filters.office,
    country: 'all',
    manager: 'all',
    searchTerm: ''
  };

  const {
    projects,
    members,
    memberTotals,
    projectTotals,
    allocationMap,
    weekStartDate,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, extendedFilters);
  
  // Safety checks for data
  const hasMembers = Array.isArray(members) && members.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  // Generate week label
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  // Render loading state
  if (isLoading || !hasProjects) {
    return <ResourceTableLoadingState />;
  }

  // Render error state
  if (error) {
    return <ResourceTableErrorState error={error} />;
  }

  // Render empty state
  if (!hasMembers) {
    return <EmptyResourceState />;
  }

  return (
    <EnhancedWeeklyResourceTable
      members={members}
      projects={projects}
      memberTotals={memberTotals}
      projectTotals={projectTotals}
      allocationMap={allocationMap}
      weekStartDate={weekStartDate}
    />
  );
};
