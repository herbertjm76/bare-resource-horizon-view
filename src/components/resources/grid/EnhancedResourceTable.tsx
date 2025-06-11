
import React from 'react';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { GridDaysHeader } from './GridDaysHeader';
import { DayInfo } from './types';

interface EnhancedResourceTableProps {
  projects: any[];
  days: DayInfo[];
  expandedProjects: string[];
  tableWidth: number;
  onToggleProjectExpand: (projectId: string) => void;
}

export const EnhancedResourceTable: React.FC<EnhancedResourceTableProps> = ({
  projects,
  days,
  expandedProjects,
  tableWidth,
  onToggleProjectExpand
}) => {
  console.log('EnhancedResourceTable render:', {
    projectsCount: projects.length,
    expandedProjects,
    daysCount: days.length
  });

  return (
    <table 
      className="enhanced-resource-table w-full" 
      style={{
        minWidth: `${tableWidth}px`,
        width: '100%'
      }}
    >
      <thead>
        <GridDaysHeader days={days} />
      </thead>
      <tbody>
        {projects.map((project, index) => {
          const isExpanded = expandedProjects.includes(project.id);
          console.log('Rendering project:', project.id, 'isExpanded:', isExpanded);
          
          return (
            <ProjectRow 
              key={project.id} 
              project={project} 
              days={days} 
              isExpanded={isExpanded} 
              onToggleExpand={() => {
                console.log('Toggle expand called for project:', project.id);
                onToggleProjectExpand(project.id);
              }} 
              isEven={index % 2 === 0} 
            />
          );
        })}
      </tbody>
    </table>
  );
};
