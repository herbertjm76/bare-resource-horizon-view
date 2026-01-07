import React, { useRef, useCallback } from 'react';
import { WeekInfo } from '../hooks/useGridWeeks';
import { PersonProject, PersonResourceData } from '@/hooks/usePersonResourceData';
import { useAllocationInput } from '../hooks/useAllocationInput';
import { logger } from '@/utils/logger';
import { toUTCDateKey } from '@/utils/dateKey';

interface ProjectAllocationRowProps {
  project: PersonProject;
  person: PersonResourceData;
  weeks: WeekInfo[];
  isEven: boolean;
  projectIndex: number;
  selectedDate?: Date;
  periodToShow?: number;
  onLocalAllocationChange?: (projectId: string, weekKey: string, hours: number) => void;
  initialAllocations?: Record<string, number>; // Pre-loaded allocations from parent
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  project,
  person,
  weeks,
  isEven,
  projectIndex,
  selectedDate,
  periodToShow,
  onLocalAllocationChange,
  initialAllocations
}) => {
  const rowBgColor = isEven ? '#f9fafb' : '#ffffff';
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Use pre-loaded allocations from parent as the base
  // The fetchedAllocations from useAllocationInput will be used for real-time updates after saves
  const {
    allocations: fetchedAllocations,
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
    onAllocationChange: (resourceId, weekKey, hours) => {
      logger.debug(`Person ${resourceId} allocation changed for project ${project.projectId} on week ${weekKey}: ${hours}h`);
      // Update local person totals immediately
      onLocalAllocationChange?.(project.projectId, weekKey, hours);
    }
  });

  // Merge initial allocations with fetched ones (fetched takes priority for real-time updates)
  const allocations = { ...project.allocations, ...fetchedAllocations };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, currentWeekKey: string, currentIndex: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < weeks.length) {
          const nextWeekKey = toUTCDateKey(weeks[nextIndex].weekStartDate);
          const nextInput = inputRefs.current[nextWeekKey];
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevWeekKey = toUTCDateKey(weeks[prevIndex].weekStartDate);
          const prevInput = inputRefs.current[prevWeekKey];
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
      } else if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
      // Let Tab behave natively so it follows DOM order
    },
    [weeks]
  );

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
      
      {/* Week allocation cells */}
      {weeks.map((week, weekIndex) => {
        const weekKey = toUTCDateKey(week.weekStartDate);
        const allocation = allocations[weekKey] || 0;
        
        return (
          <td 
            key={weekKey}
            className="workload-resource-cell resource-week-column"
            style={{
              width: '80px',
              minWidth: '80px',
              maxWidth: '80px',
              backgroundColor: rowBgColor,
              textAlign: 'center',
              padding: '4px',
              borderRight: '1px solid rgba(229, 231, 235, 0.8)',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              verticalAlign: 'middle',
              ...(week.isPreviousWeek && {
                opacity: 0.5
              })
            }}
            tabIndex={-1}
            onClick={() => {
              const input = inputRefs.current[weekKey];
              if (input && !input.disabled) {
                input.focus();
                input.select();
              }
            }}
          >
            <input
              ref={(el) => inputRefs.current[weekKey] = el}
              type="number"
              min="0"
              max="200"
              value={inputValues[weekKey] || ''}
              onChange={(e) => handleInputChange(weekKey, e.target.value)}
              onBlur={(e) => handleInputBlur(weekKey, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(e, weekKey, weekIndex)}
              disabled={isLoading || week.isPreviousWeek}
              className={`
                w-full h-full px-1 py-1 text-center border-0 bg-transparent
                focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white
                ${allocation > 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}
                ${week.isPreviousWeek ? 'cursor-not-allowed' : ''}
              `}
              style={{
                fontSize: '13px',
                lineHeight: '24px',
                height: '28px',
                width: '100%',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                margin: 0
              }}
              placeholder="0"
            />
          </td>
        );
      })}
    </tr>
  );
};
