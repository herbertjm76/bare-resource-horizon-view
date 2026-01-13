
import React from 'react';
import { WorkloadStyleWeekGridHeader } from './WorkloadStyleWeekGridHeader';
import { WorkloadStyleProjectRow } from './WorkloadStyleProjectRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import './workload-resource-grid.css';
import './tablet-optimizations.css';

interface MemberFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

interface WorkloadStyleResourceGridProps {
  projects: any[];
  weeks: WeekInfo[];
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
  selectedDate?: Date;
  periodToShow?: number;
  memberFilters?: MemberFilters;
}

export const WorkloadStyleResourceGrid: React.FC<WorkloadStyleResourceGridProps> = ({
  projects,
  weeks,
  expandedProjects,
  onToggleProjectExpand,
  selectedDate,
  periodToShow,
  memberFilters
}) => {
  // Calculate total table width: project column (250px) + week columns (80px each)
  const tableWidth = 250 + weeks.length * 80;
  
  // Determine if we need to show scrollbar (more than ~10 weeks will overflow on most screens)
  const needsScroll = weeks.length > 8;
 
  return (
    <div className="workload-resource-grid-container">
      <div 
        className="workload-resource-table-wrapper"
        style={{
          overflowX: needsScroll ? 'scroll' : 'auto'
        }}
      >
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
                memberFilters={memberFilters}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
