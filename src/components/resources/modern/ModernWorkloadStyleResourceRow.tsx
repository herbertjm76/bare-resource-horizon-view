
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DayInfo } from '../grid/types';

interface ModernWorkloadStyleResourceRowProps {
  resource: any;
  project: any;
  days: DayInfo[];
  isEven: boolean;
  resourceIndex: number;
}

export const ModernWorkloadStyleResourceRow: React.FC<ModernWorkloadStyleResourceRowProps> = ({
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

  const rowClass = `workload-grid-row bg-gray-50 border-b border-gray-200`;

  return (
    <tr className={rowClass}>
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0px',
          zIndex: 20,
          backgroundColor: '#fcfcfc'
        }}
      >
        <div className="member-info flex items-center gap-3 p-3 pl-12">
          <Avatar className="member-avatar w-8 h-8">
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white', fontSize: '12px' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="resource-details flex-1 min-w-0">
            <div className="resource-name text-sm font-medium text-gray-900 truncate">
              {displayName}
            </div>
            <div className="resource-role text-xs text-gray-600 truncate">
              {resource.role}
            </div>
            {resource.isPending && (
              <span className="pending-badge bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded mt-1 inline-block">
                Pending
              </span>
            )}
          </div>
        </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day) => {
        const dayKey = day.date.toISOString().split('T')[0];
        const allocation = resource.allocations?.[dayKey] || 0;
        
        let cellClass = 'workload-grid-cell week-cell text-center';
        if (day.isWeekend) cellClass += ' bg-gray-100';
        if (allocation > 0) cellClass += ' has-allocation';
        
        return (
          <td 
            key={dayKey} 
            className={cellClass}
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px'
            }}
          >
            <div className="allocation-input p-1">
              <input
                type="number"
                className="allocation-field w-6 h-6 text-center text-xs border-0 bg-transparent focus:bg-white focus:border focus:border-blue-500 focus:rounded"
                value={allocation || ''}
                onChange={(e) => {
                  // Handle allocation change
                  console.log('Allocation change:', {
                    resource: resource.id,
                    day: dayKey,
                    value: e.target.value
                  });
                }}
                placeholder="0"
                min="0"
                max="24"
                step="0.5"
                style={{
                  backgroundColor: allocation > 0 ? '#10b981' : 'transparent',
                  color: allocation > 0 ? 'white' : 'inherit',
                  fontWeight: allocation > 0 ? '600' : 'normal'
                }}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
};
