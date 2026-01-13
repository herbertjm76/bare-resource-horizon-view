import React, { useRef, useState, useCallback } from 'react';
import { PersonGridHeader } from './PersonGridHeader';
import { PersonRow } from './PersonRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import '../modern/workload-resource-grid.css';
import { PersonResourceData } from '@/hooks/usePersonResourceData';

interface PersonResourceGridProps {
  personData: PersonResourceData[];
  weeks: WeekInfo[];
  expandedPeople: string[];
  onTogglePersonExpand: (personId: string) => void;
  selectedDate?: Date;
  periodToShow?: number;
  onRefresh: () => void;
}

export const PersonResourceGrid: React.FC<PersonResourceGridProps> = ({
  personData,
  weeks,
  expandedPeople,
  onTogglePersonExpand,
  selectedDate,
  periodToShow,
  onRefresh
}) => {
  const tableWidth = 250 + (weeks.length * 80);
  const needsScroll = weeks.length > 8;

  // Drag-to-scroll functionality
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
    const walk = (x - startX) * 1.5;
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
 
  return (
    <div className="bg-background rounded-lg shadow-sm border border-border">
      <div className="p-4">
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
              className="workload-resource-table"
              style={{ 
                width: `${tableWidth}px`,
                minWidth: `${tableWidth}px`,
                userSelect: isDragging ? 'none' : 'auto'
              }}
            >
              <PersonGridHeader weeks={weeks} />
              
              <tbody>
                {personData.map((person, index) => (
                  <PersonRow
                    key={person.personId}
                    person={person}
                    weeks={weeks}
                    isExpanded={expandedPeople.includes(person.personId)}
                    onToggleExpand={() => onTogglePersonExpand(person.personId)}
                    isEven={index % 2 === 0}
                    selectedDate={selectedDate}
                    periodToShow={periodToShow}
                    onRefresh={onRefresh}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
