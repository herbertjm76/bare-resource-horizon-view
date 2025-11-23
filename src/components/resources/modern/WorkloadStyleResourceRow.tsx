
import React, { useRef, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DayInfo } from '../grid/types';
import { useAllocationInput } from '../hooks/useAllocationInput';

interface WorkloadStyleResourceRowProps {
  resource: any;
  project: any;
  days: DayInfo[];
  isEven: boolean;
  resourceIndex: number;
  onAllocationChange?: (resourceId: string, dayKey: string, hours: number) => void;
  selectedDate?: Date;
  periodToShow?: number;
}

export const WorkloadStyleResourceRow: React.FC<WorkloadStyleResourceRowProps> = ({
  resource,
  project,
  days,
  isEven,
  resourceIndex,
  onAllocationChange,
  selectedDate,
  periodToShow
}) => {
  const displayName = resource.first_name && resource.last_name 
    ? `${resource.first_name} ${resource.last_name}`
    : resource.name;

  const initials = resource.first_name && resource.last_name
    ? `${resource.first_name.charAt(0)}${resource.last_name.charAt(0)}`
    : resource.name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2);

  const rowBgColor = '#fcfcfc';
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  // Use the allocation input system for this resource
  const {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  } = useAllocationInput({
    projectId: project.id,
    resourceId: resource.id,
    resourceType: resource.isPending ? 'pre_registered' : 'active',
    selectedDate,
    periodToShow,
    onAllocationChange: (resourceId, dayKey, hours) => {
      // Update the parent project's allocation state immediately
      onAllocationChange?.(resourceId, dayKey, hours);
      console.log(`Resource ${resourceId} allocation changed for ${dayKey}: ${hours}h`);
    }
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, currentDayKey: string, currentIndex: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < days.length) {
          const nextDayKey = days[nextIndex].date.toISOString().split('T')[0];
          const nextInput = inputRefs.current[nextDayKey];
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevDayKey = days[prevIndex].date.toISOString().split('T')[0];
          const prevInput = inputRefs.current[prevDayKey];
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
    [days]
  );

  return (
    <tr className="workload-resource-row resource-row">
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-resource-cell project-resource-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 20,
          textAlign: 'left',
          padding: '8px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
          verticalAlign: 'middle',
          height: '32px'
        }}
      >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgb(111, 75, 246)' }}>
              <AvatarImage src={resource.avatar_url} alt={displayName} />
              <AvatarFallback className="bg-gradient-modern text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div style={{ flex: '1', minWidth: '0' }}>
              <span style={{ 
                fontSize: '13px',
                fontWeight: '400',
                color: 'hsl(var(--muted-foreground))',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {displayName}
              </span>
            </div>
          </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day, dayIndex) => {
        const dayKey = day.date.toISOString().split('T')[0];
        // Get allocation from the proper allocation system
        const allocation = allocations[dayKey] || 0;
        
        let cellBgColor = 'transparent'; // Let CSS handle the background
        
        return (
          <td 
            key={dayKey} 
            className="workload-resource-cell day-column"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              textAlign: 'center',
              padding: '2px',
              borderRight: '1px solid rgba(156, 163, 175, 0.6)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
              verticalAlign: 'middle'
            }}
            tabIndex={-1}
            onClick={() => {
              const input = inputRefs.current[dayKey];
              if (input && !input.disabled) {
                input.focus();
                input.select();
              }
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
              disabled={isLoading}
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
