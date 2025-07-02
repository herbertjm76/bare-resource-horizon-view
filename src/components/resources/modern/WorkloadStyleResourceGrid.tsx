
import React from 'react';
import { WorkloadStyleGridHeader } from './WorkloadStyleGridHeader';
import { WorkloadStyleProjectRow } from './WorkloadStyleProjectRow';
import { DayInfo } from '../grid/types';
import './workload-resource-grid.css';

interface WorkloadStyleResourceGridProps {
  projects: any[];
  days: DayInfo[];
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
}

export const WorkloadStyleResourceGrid: React.FC<WorkloadStyleResourceGridProps> = ({
  projects,
  days,
  expandedProjects,
  onToggleProjectExpand
}) => {
  // Calculate table width: project column (250px) + day columns (30px each)
  const totalWidth = 250 + (days.length * 30);

  return (
    <div className="workload-grid-container">
      <div className="workload-table-wrapper">
        <table 
          className="workload-grid-table"
          style={{ 
            minWidth: `${totalWidth}px`
          }}
        >
          <WorkloadStyleGridHeader days={days} />
          
          <tbody>
            {projects.map((project, index) => (
              <WorkloadStyleProjectRow
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
