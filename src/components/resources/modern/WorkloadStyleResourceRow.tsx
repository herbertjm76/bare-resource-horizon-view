
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
    <tr className={`workload-grid-row ${isEven ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
      {/* Resource info column - Fixed width, sticky */}
      <td 
        className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px'
        }}
      >
        <div className="member-info">
          <Avatar className="member-avatar">
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="member-name">
            {displayName}
          </span>
          {resource.role && (
            <div className="resource-role text-xs text-gray-600 truncate">
              {resource.role}
            </div>
          )}
          {resource.isPending && (
            <span className="pending-badge bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded mt-1 inline-block">
              Pending
            </span>
          )}
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
            className="workload-grid-cell week-cell text-center border-r border-gray-200"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: cellBgColor,
              padding: '2px'
            }}
          >
            {allocation > 0 ? (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold cursor-help transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white'
                }}
              >
                {allocation}
              </div>
            ) : (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium"
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af'
                }}
              >
                0
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};
