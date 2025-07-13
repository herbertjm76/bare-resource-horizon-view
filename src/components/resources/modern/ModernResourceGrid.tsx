
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
  filters,
  displayOptions,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects,
  onToggleProjectExpand
}) => {
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const filteredProjects = useFilteredProjects(projects, filters);
  const days = useGridDays(startDate, periodToShow, displayOptions);

  if (isLoadingProjects) {
    return <GridLoadingState />;
  }

  if (!filteredProjects?.length) {
    return <GridEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Project Resources</h3>
          <p className="text-sm text-gray-600 mt-1">
            Team workload styled grid with sticky # and Project/Resource columns
          </p>
        </div>
        
        <div className="p-4">
          <WorkloadStyleResourceGrid
            projects={filteredProjects}
            days={days}
            expandedProjects={expandedProjects}
            onToggleProjectExpand={onToggleProjectExpand}
            selectedDate={startDate}
            periodToShow={periodToShow}
          />
        </div>
      </div>
    </div>
  );
};
