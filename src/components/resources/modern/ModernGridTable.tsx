
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
  // Calculate total width: fixed columns + day columns (matching workload style)
  const totalWidth = 310 + (days.length * 30); // 60px control + 250px project + day columns

  return (
    <div className="workload-grid-container">
      <div className="workload-table-wrapper">
        <table 
          className="workload-grid-table enhanced-resource-table"
          style={{ 
            minWidth: `${totalWidth}px`,
            width: `${totalWidth}px`
          }}
        >
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
