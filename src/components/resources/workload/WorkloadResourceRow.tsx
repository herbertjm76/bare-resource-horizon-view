
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DayInfo } from '../grid/types';

interface WorkloadResourceRowProps {
  resource: any;
  project: any;
  days: DayInfo[];
  isEven: boolean;
}

export const WorkloadResourceRow: React.FC<WorkloadResourceRowProps> = ({
  resource,
  project,
  days,
  isEven
}) => {
  const displayName = resource.first_name && resource.last_name 
    ? `${resource.first_name} ${resource.last_name}`
    : resource.name;

  const initials = resource.first_name && resource.last_name
    ? `${resource.first_name.charAt(0)}${resource.last_name.charAt(0)}`
    : resource.name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2);

  return (
    <tr className="workload-grid-row bg-gray-50 border-b border-gray-200">
      {/* Resource info column */}
      <td 
        className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px'
        }}
      >
        <div className="member-info pl-11">
          <Avatar className="member-avatar">
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="member-name text-sm font-medium text-gray-900">
              {displayName}
            </span>
            <span className="text-xs text-gray-500">{resource.role}</span>
            {resource.isPending && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded mt-1 inline-block w-fit">
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
        
        return (
          <td 
            key={dayKey} 
            className="workload-grid-cell text-center"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px'
            }}
          >
            <div className="flex items-center justify-center min-h-[24px]">
              <input
                type="number"
                className="w-6 h-6 text-xs text-center border-none bg-transparent focus:bg-white focus:border focus:border-blue-500 rounded"
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
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
};
