
import React from 'react';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { GridDaysHeader } from './GridDaysHeader';
import { DayInfo } from './types';
import '../css/project-resourcing-table.css';

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
  // Calculate total table width based on fixed columns + day columns
  const calculatedWidth = 48 + 200 + (days.length * 32);

  return (
    <div className="project-resourcing-container">
      <table 
        className="project-resourcing-table" 
        style={{ 
          width: `${calculatedWidth}px`,
          minWidth: `${calculatedWidth}px`
        }}
      >
        <colgroup>
          <col className="counter-column" style={{ width: '48px' }} />
          <col className="project-name-column" style={{ width: '200px' }} />
          {days.map((_, index) => (
            <col key={index} className="day-column" style={{ width: '32px' }} />
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
    </div>
  );
};
