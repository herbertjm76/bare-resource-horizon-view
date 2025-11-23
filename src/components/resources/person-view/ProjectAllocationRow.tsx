import React, { useRef, useCallback } from 'react';
import { DayInfo } from '../grid/types';
import { PersonProject, PersonResourceData } from '@/hooks/usePersonResourceData';
import { useAllocationInput } from '../hooks/useAllocationInput';

interface ProjectAllocationRowProps {
  project: PersonProject;
  person: PersonResourceData;
  days: DayInfo[];
  isEven: boolean;
  projectIndex: number;
  selectedDate?: Date;
  periodToShow?: number;
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  project,
  person,
  days,
  isEven,
  projectIndex,
  selectedDate,
  periodToShow
}) => {
  const rowBgColor = isEven ? '#f9fafb' : '#ffffff';
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Use the allocation input system
  const {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  } = useAllocationInput({
    projectId: project.projectId,
    resourceId: person.personId,
    resourceType: person.resourceType,
    selectedDate,
    periodToShow,
    onAllocationChange: (resourceId, dayKey, hours) => {
      console.log(`Person ${resourceId} allocation changed for project ${project.projectId} on ${dayKey}: ${hours}h`);
    }
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, currentDayKey: string, currentIndex: number) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      
      if (!e.shiftKey) {
        // Tab forward
        const nextIndex = currentIndex + 1;
        if (nextIndex < days.length) {
          const nextDayKey = days[nextIndex].date.toISOString().split('T')[0];
          const nextInput = inputRefs.current[nextDayKey];
          if (nextInput) {
            setTimeout(() => nextInput.focus(), 0);
          }
        }
      } else {
        // Shift+Tab backward
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevDayKey = days[prevIndex].date.toISOString().split('T')[0];
          const prevInput = inputRefs.current[prevDayKey];
          if (prevInput) {
            setTimeout(() => prevInput.focus(), 0);
          }
        }
      }
    } else if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < days.length) {
        const nextDayKey = days[nextIndex].date.toISOString().split('T')[0];
        const nextInput = inputRefs.current[nextDayKey];
        if (nextInput) {
          setTimeout(() => nextInput.focus(), 0);
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        const prevDayKey = days[prevIndex].date.toISOString().split('T')[0];
        const prevInput = inputRefs.current[prevDayKey];
        if (prevInput) {
          setTimeout(() => prevInput.focus(), 0);
        }
      }
    }
  }, [days]);

  return (
    <tr className="workload-resource-row resource-row">
      {/* Project info column - Fixed width, sticky */}
      <td 
        className="workload-resource-cell resource-name-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 10,
          backgroundColor: rowBgColor,
          textAlign: 'left',
          padding: '8px 16px 8px 48px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          verticalAlign: 'middle'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#374151',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {project.projectName}
            </div>
            {project.projectCode && (
              <div style={{ 
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                {project.projectCode}
              </div>
            )}
          </div>
        </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day, dayIndex) => {
        const dayKey = day.date.toISOString().split('T')[0];
        const allocation = allocations[dayKey] || 0;
        
        return (
          <td 
            key={dayKey}
            className="workload-resource-cell resource-day-column"
            style={{
              width: '30px',
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: rowBgColor,
              textAlign: 'center',
              padding: '2px',
              borderRight: '1px solid rgba(229, 231, 235, 0.8)',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              verticalAlign: 'middle'
            }}
          >
            <input
              ref={(el) => inputRefs.current[dayKey] = el}
              type="number"
              min="0"
              max="24"
              value={inputValues[dayKey] || ''}
              onChange={(e) => handleInputChange(dayKey, e.target.value)}
              onBlur={(e) => handleInputBlur(dayKey, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(e, dayKey, dayIndex)}
              disabled={isLoading || isSaving}
              className={`
                w-full h-full px-0 py-0 text-center border-0 bg-transparent
                focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white
                ${allocation > 0 ? 'font-medium text-primary' : 'text-muted-foreground'}
                ${day.isWeekend ? 'bg-muted/20' : ''}
              `}
              style={{
                fontSize: '10px',
                lineHeight: '20px',
                height: '20px',
                width: '100%',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                margin: 0
              }}
            />
          </td>
        );
      })}
    </tr>
  );
};
