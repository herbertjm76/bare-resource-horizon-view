
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
  // Calculate minimum table width based on fixed columns and day columns
  const minTableWidth = 48 + 200 + (days.length * 32) + 20; // counter + project name + days + buffer
  const actualTableWidth = Math.max(minTableWidth, tableWidth);

  return (
    <table 
      className="enhanced-resource-table" 
      style={{
        minWidth: `${actualTableWidth}px`,
        width: `${actualTableWidth}px`
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
