
import React, { useState } from 'react';
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
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  // Generate array of days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);

  // Filter and enhance projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

  // Calculate the table width
  const tableWidth = useGridTableWidth(days.length);
  
  // Toggle project expansion with better logging
  const toggleProjectExpanded = (projectId: string) => {
    console.log('toggleProjectExpanded called for:', projectId);
    console.log('Current expandedProjects:', expandedProjects);
    
    setExpandedProjects(prev => {
      const isCurrentlyExpanded = prev.includes(projectId);
      const newExpandedProjects = isCurrentlyExpanded 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId];
      
      console.log('New expandedProjects will be:', newExpandedProjects);
      return newExpandedProjects;
    });
  };
  
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
                  console.log('Rendering project in ResourceAllocationGrid:', project.id, 'isExpanded:', isExpanded);
                  
                  return (
                    <ProjectRow 
                      key={project.id} 
                      project={project} 
                      days={days} 
                      isExpanded={isExpanded} 
                      onToggleExpand={() => {
                        console.log('onToggleExpand called from ResourceAllocationGrid for:', project.id);
                        toggleProjectExpanded(project.id);
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
