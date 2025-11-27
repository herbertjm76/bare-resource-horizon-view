
import React from 'react';
import { WorkloadStyleResourceGrid } from './WorkloadStyleResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useGridDays } from '../hooks/useGridDays';
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
  const days = useGridDays(startDate, periodToShow, displayOptions);

  if (isLoadingProjects) {
    return <GridLoadingState />;
  }

  if (!filteredProjects?.length) {
    return <GridEmptyState />;
  }

  return (
    <WorkloadStyleResourceGrid
      projects={filteredProjects}
      days={days}
      expandedProjects={expandedProjects}
      onToggleProjectExpand={onToggleProjectExpand}
      selectedDate={startDate}
      periodToShow={periodToShow}
    />
  );
};
