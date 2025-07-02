
import React from 'react';
import { ModernWorkloadStyleHeader } from './ModernWorkloadStyleHeader';
import { ModernWorkloadStyleRow } from './ModernWorkloadStyleRow';
import { DayInfo } from '../grid/types';

interface ModernWorkloadStyleGridProps {
  projects: any[];
  days: DayInfo[];
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
}

export const ModernWorkloadStyleGrid: React.FC<ModernWorkloadStyleGridProps> = ({
  projects,
  days,
  expandedProjects,
  onToggleProjectExpand
}) => {
  // Calculate total width: fixed columns + day columns (matching workload exactly)
  const totalWidth = 250 + (days.length * 30); // 250px project column + day columns

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
          <ModernWorkloadStyleHeader days={days} />
          
          <tbody>
            {projects.map((project, index) => (
              <ModernWorkloadStyleRow
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
