
import React from 'react';
import { WorkloadResourceHeader } from './WorkloadResourceHeader';
import { WorkloadProjectRow } from './WorkloadProjectRow';
import { DayInfo } from '../grid/types';

interface WorkloadResourceTableProps {
  projects: any[];
  days: DayInfo[];
}

export const WorkloadResourceTable: React.FC<WorkloadResourceTableProps> = ({
  projects,
  days
}) => {
  // Calculate total width: fixed columns + day columns (matching workload style exactly)
  const totalWidth = 250 + (days.length * 30); // 250px project + day columns

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
          <WorkloadResourceHeader days={days} />
          
          <tbody>
            {projects.map((project, index) => (
              <WorkloadProjectRow
                key={project.id}
                project={project}
                days={days}
                isEven={index % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
