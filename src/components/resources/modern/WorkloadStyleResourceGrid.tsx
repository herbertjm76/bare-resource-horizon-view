
import React, { useRef, useState, useCallback } from 'react';
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
  // Pinned items support
  pinnedIds?: string[];
  onTogglePin?: (projectId: string) => void;
}

export const WorkloadStyleResourceGrid: React.FC<WorkloadStyleResourceGridProps> = ({
  projects,
  weeks,
  expandedProjects,
  onToggleProjectExpand,
  selectedDate,
  periodToShow,
  memberFilters,
  pinnedIds = [],
  onTogglePin
}) => {
  // Calculate total table width: project column (250px) + week columns (80px each)
  const tableWidth = 250 + weeks.length * 80;
  
  // Determine if we need to show scrollbar (more than ~10 weeks will overflow on most screens)
  const needsScroll = weeks.length > 8;

  // Drag-to-scroll functionality
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, [role="button"]')) {
      return;
    }
    
    if (wrapperRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - wrapperRef.current.offsetLeft);
      setScrollLeft(wrapperRef.current.scrollLeft);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !wrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiply for faster scroll
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
 
  return (
    <div className="workload-resource-grid-container flex justify-center">
      <div 
        ref={wrapperRef}
        className={`workload-resource-table-wrapper ${isDragging ? 'is-dragging' : ''} ${needsScroll ? 'can-scroll' : ''}`}
        style={{
          overflowX: needsScroll ? 'scroll' : 'auto',
          cursor: needsScroll ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <table 
          className="workload-resource-table modern-week-view-table"
          style={{ 
            width: `${tableWidth}px`,
            minWidth: `${tableWidth}px`,
            userSelect: isDragging ? 'none' : 'auto'
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
                isPinned={pinnedIds.includes(project.id)}
                onTogglePin={onTogglePin ? () => onTogglePin(project.id) : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
