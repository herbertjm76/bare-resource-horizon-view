
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
            <Avatar style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid hsl(var(--primary))' }}>
              <AvatarImage src={resource.avatar_url} alt={displayName} />
              <AvatarFallback style={{ backgroundColor: 'hsl(var(--primary))', color: 'white' }}>
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
      {days.map((day) => {
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
          >
            <Input
              type="number"
              min="0"
              max="24"
              value={inputValues[dayKey] || ''}
              onChange={(e) => handleInputChange(dayKey, e.target.value)}
              onBlur={(e) => handleInputBlur(dayKey, e.target.value)}
              className={`
                w-5 h-5 px-0 py-0 text-center border-0 
                focus:border focus:border-primary focus:ring-1 focus:ring-primary
                ${allocation > 0 ? 'bg-primary/10 text-primary font-medium' : 'bg-muted/50 text-muted-foreground'}
                ${isSaving ? 'opacity-50' : ''}
                ${day.isWeekend ? 'bg-muted/30' : ''}
              `}
              placeholder=""
              disabled={isLoading || isSaving}
              style={{
                fontSize: '10px',
                lineHeight: '1',
                minHeight: '20px',
                borderRadius: '2px',
                textAlign: 'center'
              }}
            />
          </td>
        );
      })}
    </tr>
  );
};
