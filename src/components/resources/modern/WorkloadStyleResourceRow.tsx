
import React, { useRef, useCallback, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { WeekInfo } from '../hooks/useGridWeeks';
import { useAllocationInput } from '../hooks/useAllocationInput';
import { ResourceAllocationDialog } from '../dialogs/ResourceAllocationDialog';
import { ResourceActions } from '../components/ResourceActions';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getInputConfig } from '@/utils/allocationDisplay';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { logger } from '@/utils/logger';
import { toUTCDateKey } from '@/utils/dateKey';

interface WorkloadStyleResourceRowProps {
  resource: any;
  project: any;
  weeks: WeekInfo[];
  isEven: boolean;
  resourceIndex: number;
  onAllocationChange?: (resourceId: string, weekKey: string, hours: number) => void;
  onDeleteResource?: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
  selectedDate?: Date;
  periodToShow?: number;
  projectAllocations: Record<string, number>;
  getAllocationKey: (resourceId: string, weekKey: string) => string;
}

export const WorkloadStyleResourceRow: React.FC<WorkloadStyleResourceRowProps> = ({
  resource,
  project,
  weeks,
  isEven,
  resourceIndex,
  onAllocationChange,
  onDeleteResource,
  onCheckOtherProjects,
  selectedDate,
  periodToShow,
  projectAllocations,
  getAllocationKey
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const displayName = resource.first_name && resource.last_name 
    ? `${resource.first_name} ${resource.last_name}`
    : resource.name;
  
  const initials = resource.first_name && resource.last_name
    ? `${resource.first_name.charAt(0)}${resource.last_name.charAt(0)}`
    : resource.name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2);

  // Get week start date from the first week in weeks array
  // IMPORTANT: Use canonical UTC date keys to match allocation_date in DB.
  const weekStartDate = weeks.length > 0 ? toUTCDateKey(weeks[0].weekStartDate) : toUTCDateKey(new Date());

  const rowBgColor = '#fcfcfc';
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { workWeekHours, displayPreference } = useAppSettings();
  const inputConfig = getInputConfig(displayPreference);
  const capacity = getMemberCapacity(resource?.weekly_capacity, workWeekHours);

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
    capacityHours: capacity,
    onAllocationChange: (resourceId, weekKey, hours) => {
      // Update the parent project's allocation state immediately
      onAllocationChange?.(resourceId, weekKey, hours);
      logger.debug(`Resource ${resourceId} allocation changed for week ${weekKey}: ${hours}h`);
    }
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, currentWeekKey: string, currentIndex: number) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < weeks.length) {
          const nextWeekKey = weeks[nextIndex].weekStartDate.toISOString().split('T')[0];
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
          const prevWeekKey = weeks[prevIndex].weekStartDate.toISOString().split('T')[0];
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

  // Calculate total allocated hours for this resource from project-level allocations
  const totalAllocatedHours = weeks.reduce((sum, week) => {
    const weekKey = toUTCDateKey(week.weekStartDate);
    const allocationKey = getAllocationKey(resource.id, weekKey);
    const hours = projectAllocations[allocationKey] || 0;
    return sum + hours;
  }, 0);

  return (
    <>
      <ResourceAllocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={{
          id: resource.id,
          firstName: resource.first_name,
          lastName: resource.last_name,
          avatarUrl: resource.avatar_url,
          type: resource.isPending ? 'pre_registered' : 'active',
        }}
        weekStartDate={weekStartDate}
        compact={false}
      />
      <tr className="workload-resource-row resource-row group">
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-resource-cell project-resource-column cursor-pointer hover:bg-muted/50"
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
        onClick={() => setDialogOpen(true)}
      >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
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
            {onDeleteResource && (
              <div onClick={(e) => e.stopPropagation()}>
                <ResourceActions
                  resourceId={resource.id}
                  resourceName={displayName}
                  resourceType={resource.isPending ? 'pre_registered' : 'active'}
                  totalAllocatedHours={totalAllocatedHours}
                  onDeleteResource={onDeleteResource}
                  onCheckOtherProjects={onCheckOtherProjects}
                />
              </div>
            )}
          </div>
      </td>
      
      {/* Week allocation cells */}
      {weeks.map((week, weekIndex) => {
        const weekKey = toUTCDateKey(week.weekStartDate);
        // Get allocation from the project-level allocation map
        const allocationKey = getAllocationKey(resource.id, weekKey);
        const allocation = projectAllocations[allocationKey] || 0;
        
        return (
          <td 
            key={weekKey} 
            className="workload-resource-cell week-column"
            style={{ 
              width: '80px', 
              minWidth: '80px',
              maxWidth: '80px',
              textAlign: 'center',
              padding: '4px',
              borderRight: '1px solid rgba(156, 163, 175, 0.6)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
              verticalAlign: 'middle',
              ...(week.isPreviousWeek && {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
              min={String(inputConfig.min)}
              max={String(inputConfig.max)}
              step={String(inputConfig.step)}
              value={inputValues[weekKey] ?? ''}
              onChange={(e) => handleInputChange(weekKey, e.target.value)}
              onBlur={(e) => handleInputBlur(weekKey, e.target.value)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(e, weekKey, weekIndex)}
              disabled={isLoading || isSaving || week.isPreviousWeek}
              className={
                `
                w-full h-full px-1 py-1 text-center border-0 bg-transparent
                focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white
                ${allocation > 0 ? 'font-semibold text-primary' : 'text-muted-foreground'}
                ${week.isPreviousWeek ? 'cursor-not-allowed' : ''}
              `
              }
              style={{
                fontSize: '13px',
                lineHeight: '24px',
                height: '28px',
                width: '100%',
                MozAppearance: 'textfield',
                WebkitAppearance: 'none',
                margin: 0
              }}
              placeholder={inputConfig.placeholder}
            />
          </td>
        );
      })}
    </tr>
    </>
  );
};
