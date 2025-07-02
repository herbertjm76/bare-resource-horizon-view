
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
}

export const ModernResourceGrid: React.FC<ModernResourceGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects
}) => {
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const filteredProjects = useFilteredProjects(projects, filters);
  const days = useGridDays(startDate, periodToShow, displayOptions);

  const [localExpandedProjects, setLocalExpandedProjects] = React.useState<string[]>(expandedProjects);

  const handleToggleProjectExpand = (projectId: string) => {
    setLocalExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  if (isLoadingProjects) {
    return <GridLoadingState />;
  }

  if (!filteredProjects?.length) {
    return <GridEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Project Resources</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team allocations across projects with real-time editing
          </p>
        </div>
        
        <div className="p-4">
          <WorkloadStyleResourceGrid
            projects={filteredProjects}
            days={days}
            expandedProjects={localExpandedProjects}
            onToggleProjectExpand={handleToggleProjectExpand}
          />
        </div>
      </div>
    </div>
  );
};
