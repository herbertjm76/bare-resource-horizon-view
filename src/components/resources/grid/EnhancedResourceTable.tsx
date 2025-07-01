
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
    <table className="enhanced-resource-table">
      <colgroup>
        <col style={{ width: '48px' }} />
        <col style={{ width: '200px' }} />
        {days.map((_, index) => (
          <col key={index} style={{ width: '32px' }} />
        ))}
      </colgroup>
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
