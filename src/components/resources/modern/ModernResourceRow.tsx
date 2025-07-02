
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DayInfo } from '../grid/types';

interface ModernResourceRowProps {
  resource: any;
  project: any;
  days: DayInfo[];
  isEven: boolean;
}

export const ModernResourceRow: React.FC<ModernResourceRowProps> = ({
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

  const rowClass = `modern-resource-row ${isEven ? 'even' : 'odd'}`;

  return (
    <tr className={rowClass}>
      {/* Empty control column */}
      <td className="modern-cell control-cell"></td>
      
      {/* Resource info column */}
      <td className="modern-cell resource-info-cell">
        <div className="resource-info">
          <Avatar className="resource-avatar">
            <AvatarImage src={resource.avatar_url} alt={displayName} />
            <AvatarFallback className="avatar-fallback">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="resource-details">
            <div className="resource-name">{displayName}</div>
            <div className="resource-role">{resource.role}</div>
            {resource.isPending && (
              <span className="pending-badge">Pending</span>
            )}
          </div>
        </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day) => {
        const dayKey = day.date.toISOString().split('T')[0];
        const allocation = resource.allocations?.[dayKey] || 0;
        
        let cellClass = 'modern-cell day-cell resource-allocation';
        if (day.isWeekend) cellClass += ' weekend';
        if (day.isSunday) cellClass += ' sunday';
        if (allocation > 0) cellClass += ' has-allocation';
        
        return (
          <td key={dayKey} className={cellClass}>
            <div className="allocation-input">
              <input
                type="number"
                className="allocation-field"
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
