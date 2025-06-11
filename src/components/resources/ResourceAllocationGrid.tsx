
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { GridDaysHeader } from './grid/GridDaysHeader';
import { GridLoadingState } from './grid/GridLoadingState';
import { GridEmptyState } from './grid/GridEmptyState';
import { useGridDays } from './hooks/useGridDays';
import { useFilteredProjects } from './hooks/useFilteredProjects';
import { useGridTableWidth } from './hooks/useGridTableWidth';
import { Card } from '@/components/ui/card';
import './resources-grid.css';

interface ResourceAllocationGridProps {
  startDate: Date;
  periodToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions,
  expandedProjects,
  onToggleProjectExpand
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  
  // Generate array of days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);

  // Filter and enhance projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

  // Calculate the table width
  const tableWidth = useGridTableWidth(days.length);
  
  console.log('ResourceAllocationGrid render:', {
    filteredProjectsCount: filteredProjects.length,
    expandedProjects,
    expandedProjectsLength: expandedProjects.length
  });
  
  if (isLoading) {
    return <GridLoadingState />;
  }
  
  if (filteredProjects.length === 0) {
    return <GridEmptyState />;
  }
  
  return (
    <div className="w-full max-w-full">
      <Card className="w-full overflow-hidden border">
        <div className="grid-table-card-scroll">
          <div className="grid-table-container">
            <table 
              className="resource-allocation-table" 
              style={{
                width: `${tableWidth}px`,
                minWidth: 'max-content'
              }}
            >
              <thead>
                <GridDaysHeader days={days} />
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => {
                  const isExpanded = expandedProjects.includes(project.id);
                  console.log('ResourceAllocationGrid - Rendering project:', project.id, 'isExpanded:', isExpanded);
                  
                  return (
                    <ProjectRow 
                      key={project.id} 
                      project={project} 
                      days={days} 
                      isExpanded={isExpanded} 
                      onToggleExpand={() => {
                        console.log('ResourceAllocationGrid - onToggleExpand called for:', project.id);
                        onToggleProjectExpand(project.id);
                      }} 
                      isEven={index % 2 === 0} 
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
