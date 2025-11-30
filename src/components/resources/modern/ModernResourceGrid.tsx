
import React from 'react';
import { WorkloadStyleResourceGrid } from './WorkloadStyleResourceGrid';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { useProjects } from '@/hooks/useProjects';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useGridWeeks } from '../hooks/useGridWeeks';
import { GridLoadingState } from '../grid/GridLoadingState';
import { GridEmptyState } from '../grid/GridEmptyState';

interface ModernResourceGridProps {
  startDate: Date;
  periodToShow: number;
  sortBy?: 'name' | 'code' | 'status' | 'created';
  sortDirection?: 'asc' | 'desc';
  filters: any;
  displayOptions: any;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  expandedProjects: string[];
  totalProjects: number;
  onToggleProjectExpand: (projectId: string) => void;
}

export const ModernResourceGrid: React.FC<ModernResourceGridProps> = ({
  startDate,
  periodToShow,
  sortBy = 'created',
  sortDirection = 'asc',
  filters,
  displayOptions,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects,
  onToggleProjectExpand
}) => {
  const { projects, isLoading: isLoadingProjects } = useProjects(sortBy, sortDirection);
  const filteredProjects = useFilteredProjects(projects, filters);
  const weeks = useGridWeeks(startDate, periodToShow, displayOptions);

  // On tablet and mobile, only show the current week column
  const displayedWeeks = React.useMemo(() => {
    if (!weeks || weeks.length === 0) return weeks;

    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
    if (!isMobileOrTablet) return weeks;

    const today = startOfDay(new Date());

    const currentWeek = weeks.find((week) =>
      isWithinInterval(today, {
        start: startOfDay(week.weekStartDate),
        end: endOfDay(week.weekEndDate)
      })
    );

    return currentWeek ? [currentWeek] : weeks;
  }, [weeks]);

  if (isLoadingProjects) {
    return <GridLoadingState />;
  }

  if (!filteredProjects?.length) {
    return <GridEmptyState />;
  }

  return (
    <WorkloadStyleResourceGrid
      projects={filteredProjects}
      weeks={displayedWeeks}
      expandedProjects={expandedProjects}
      onToggleProjectExpand={onToggleProjectExpand}
      selectedDate={startDate}
      periodToShow={periodToShow}
    />
  );
};
