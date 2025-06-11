
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
        {projects.map((project, index) => (
          <ProjectRow 
            key={project.id} 
            project={project} 
            days={days} 
            isExpanded={expandedProjects.includes(project.id)} 
            onToggleExpand={() => onToggleProjectExpand(project.id)} 
            isEven={index % 2 === 0} 
          />
        ))}
      </tbody>
    </table>
  );
};
