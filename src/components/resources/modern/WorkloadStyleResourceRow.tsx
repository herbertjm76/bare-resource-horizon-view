
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
}

export const WorkloadStyleResourceRow: React.FC<WorkloadStyleResourceRowProps> = ({
  resource,
  project,
  days,
  isEven,
  resourceIndex
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
    onAllocationChange: (resourceId, dayKey, hours) => {
      // This will trigger re-calculation of project totals
      console.log(`Resource ${resourceId} allocation changed for ${dayKey}: ${hours}h`);
    }
  });

  return (
    <tr className="workload-resource-row resource-row">
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-resource-cell project-resource-column"
        style={{
          backgroundColor: rowBgColor,
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 20,
          textAlign: 'left',
          padding: '12px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
          verticalAlign: 'middle'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar style={{ width: '32px', height: '32px', borderRadius: '6px' }}>
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: '1', minWidth: '0' }}>
            <span style={{ 
              fontSize: '14px',
              fontWeight: '500',
              color: '#111827',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {displayName}
            </span>
            {resource.role && (
              <div style={{ 
                fontSize: '12px',
                color: '#6b7280',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {resource.role}
              </div>
            )}
            {resource.isPending && (
              <span style={{ 
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                marginTop: '2px'
              }}>
                Pending
              </span>
            )}
          </div>
        </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day) => {
        const dayKey = day.date.toISOString().split('T')[0];
        // Get allocation from the proper allocation system
        const allocation = allocations[dayKey] || 0;
        
        let cellBgColor = rowBgColor;
        if (day.isWeekend) cellBgColor = '#f3f4f6';
        
        return (
          <td 
            key={dayKey} 
            className="workload-resource-cell day-column"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: cellBgColor,
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
                w-6 h-6 px-1 py-0 text-center text-xs border-0 
                focus:border focus:border-primary focus:ring-1 focus:ring-primary
                ${allocation > 0 ? 'bg-primary/10 text-primary font-medium' : 'bg-muted/50 text-muted-foreground'}
                ${isSaving ? 'opacity-50' : ''}
                ${day.isWeekend ? 'bg-muted/30' : ''}
              `}
              placeholder=""
              disabled={isLoading || isSaving}
              style={{
                fontSize: '11px',
                lineHeight: '1',
                minHeight: '24px',
                borderRadius: '2px'
              }}
            />
          </td>
        );
      })}
    </tr>
  );
};
