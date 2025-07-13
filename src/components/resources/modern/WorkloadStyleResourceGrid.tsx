
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
  selectedDate?: Date;
  periodToShow?: number;
}

export const WorkloadStyleResourceGrid: React.FC<WorkloadStyleResourceGridProps> = ({
  projects,
  days,
  expandedProjects,
  onToggleProjectExpand,
  selectedDate,
  periodToShow
}) => {
  // Calculate if we should center align (for 1-month views)
  const shouldCenterAlign = days.length <= 31;
  
  // Calculate total table width: project column (250px) + day columns (30px each)
  const tableWidth = 250 + (days.length * 30);

  return (
    <div className={`workload-resource-grid-container ${shouldCenterAlign ? 'center-aligned' : ''}`}>
      <div className="workload-resource-table-wrapper">
        <table 
          className="workload-resource-table"
          style={{ 
            width: `${tableWidth}px`,
            minWidth: `${tableWidth}px`
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
                selectedDate={selectedDate}
                periodToShow={periodToShow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
