
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DayInfo } from '../grid/types';

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

  const rowBgColor = '#fcfcfc'; // Slightly different shade for resource rows

  return (
    <tr className="workload-grid-row" style={{ backgroundColor: rowBgColor }}>
      {/* Empty control column - Fixed width, sticky */}
      <td 
        className="workload-grid-cell"
        style={{
          width: '60px',
          minWidth: '60px',
          maxWidth: '60px',
          position: 'sticky',
          left: '0px',
          zIndex: 20,
          backgroundColor: rowBgColor,
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)'
        }}
      >
        {/* Empty control cell for resources */}
      </td>
      
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-grid-cell"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '60px',
          zIndex: 20,
          backgroundColor: rowBgColor,
          textAlign: 'left',
          padding: '12px 16px',
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)'
        }}
      >
        <div className="member-info flex items-center gap-3 pl-8">
          <Avatar className="w-8 h-8">
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
        
        let cellBgColor = rowBgColor;
        if (day.isWeekend) cellBgColor = '#f3f4f6';
        
        return (
          <td 
            key={dayKey} 
            className="workload-grid-cell"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: cellBgColor,
              textAlign: 'center',
              padding: '2px'
            }}
          >
            <div className="allocation-input">
              <input
                type="number"
                className="w-6 h-6 text-center text-xs border-0 bg-transparent focus:bg-white focus:border focus:border-blue-500 focus:rounded"
                value={allocation || ''}
                onChange={(e) => {
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
