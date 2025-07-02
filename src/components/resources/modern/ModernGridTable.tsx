
import React from 'react';
import { ModernTableHeader } from './ModernTableHeader';
import { ModernProjectRow } from './ModernProjectRow';
import { DayInfo } from '../grid/types';

interface ModernGridTableProps {
  projects: any[];
  days: DayInfo[];
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
}

export const ModernGridTable: React.FC<ModernGridTableProps> = ({
  projects,
  days,
  expandedProjects,
  onToggleProjectExpand
}) => {
  // Calculate total width: fixed columns + day columns
  const totalWidth = 300 + (days.length * 40); // Increased day column width for better readability

  return (
    <div className="modern-table-container">
      <div className="modern-table-scroll">
        <table 
          className="modern-resource-table"
          style={{ 
            width: `${totalWidth}px`,
            minWidth: '100%'
          }}
        >
          <colgroup>
            <col style={{ width: '60px' }} /> {/* Expand/collapse column */}
            <col style={{ width: '240px' }} /> {/* Project name column */}
            {days.map((_, index) => (
              <col key={index} style={{ width: '40px' }} />
            ))}
          </colgroup>
          
          <ModernTableHeader days={days} />
          
          <tbody>
            {projects.map((project, index) => (
              <ModernProjectRow
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
    </div>
  );
};
