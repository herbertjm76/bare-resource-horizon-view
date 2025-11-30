
import React from 'react';
import { WorkloadStyleWeekGridHeader } from './WorkloadStyleWeekGridHeader';
import { WorkloadStyleProjectRow } from './WorkloadStyleProjectRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import './workload-resource-grid.css';
import './tablet-optimizations.css';

interface WorkloadStyleResourceGridProps {
  projects: any[];
  weeks: WeekInfo[];
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
  selectedDate?: Date;
  periodToShow?: number;
}

export const WorkloadStyleResourceGrid: React.FC<WorkloadStyleResourceGridProps> = ({
  projects,
  weeks,
  expandedProjects,
  onToggleProjectExpand,
  selectedDate,
  periodToShow
}) => {
  // Calculate total table width: project column (250px) + week columns (80px each)
  const tableWidth = 250 + weeks.length * 80;
 
  return (
    <div className="workload-resource-grid-container center-aligned">
      <div className="workload-resource-table-wrapper">
        <table 
          className="workload-resource-table modern-week-view-table"
          style={{ 
            width: `${tableWidth}px`,
            minWidth: `${tableWidth}px`
          }}
        >
          <WorkloadStyleWeekGridHeader weeks={weeks} />
          
          <tbody>
            {projects.map((project, index) => (
              <WorkloadStyleProjectRow
                key={project.id}
                project={project}
                weeks={weeks}
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
