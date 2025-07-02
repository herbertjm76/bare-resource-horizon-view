
import React from 'react';
import { ModernWorkloadStyleGrid } from './ModernWorkloadStyleGrid';
import { ModernGridTable } from './ModernGridTable';
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
      {/* New Workload-Style Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Project Resources (Workload Style)</h3>
          <p className="text-sm text-gray-600 mt-1">
            Team workload styled grid with sticky columns and matching UI/UX
          </p>
        </div>
        
        <div className="p-4">
          <ModernWorkloadStyleGrid
            projects={filteredProjects}
            days={days}
            expandedProjects={localExpandedProjects}
            onToggleProjectExpand={handleToggleProjectExpand}
          />
        </div>
      </div>

      {/* Original Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Project Resources (Original Style)</h3>
          <p className="text-sm text-gray-600 mt-1">
            Original project resources grid
          </p>
        </div>
        
        <div className="p-4">
          <ModernGridTable
            projects={filteredProjects}
            days={days}
            expandedProjects={expandedProjects}
            onToggleProjectExpand={handleToggleProjectExpand}
          />
        </div>
      </div>
    </div>
  );
};
