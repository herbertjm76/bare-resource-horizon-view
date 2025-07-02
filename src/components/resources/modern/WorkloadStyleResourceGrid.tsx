
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
  
  // Determine if this is approximately a 1-month view (28-31 days)
  const isOneMonthView = days.length >= 28 && days.length <= 31;

  return (
    <div className={`workload-resource-grid-container ${isOneMonthView ? 'center-aligned' : ''}`}>
      <div className="workload-resource-table-wrapper">
        <table 
          className="workload-resource-grid-table"
          style={{ 
            minWidth: `${totalWidth}px`,
            width: `${totalWidth}px`
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
