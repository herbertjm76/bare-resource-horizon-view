import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../hooks/types';

interface WorkloadCalendarRowProps {
  member: TeamMember;
  memberIndex: number;
  weekStartDates: Array<{ date: Date; key: string }>;
  memberWeeklyData: Record<string, WeeklyWorkloadBreakdown>;
  shouldCenterAlign?: boolean;
}

export const WorkloadCalendarRow: React.FC<WorkloadCalendarRowProps> = ({
  member,
  memberIndex,
  weekStartDates,
  memberWeeklyData,
  shouldCenterAlign = false
}) => {
  const displayName = member.first_name && member.last_name 
    ? `${member.first_name} ${member.last_name}`
    : 'Unknown Member';

  const initials = member.first_name && member.last_name
    ? `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
    : 'UM';

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Calculate total hours across all weeks for this member
  const totalHours = weekStartDates.reduce((total, week) => {
    const weekData = memberWeeklyData[week.key];
    return total + (weekData?.total || 0);
  }, 0);

  const rowBgColor = memberIndex % 2 === 0 ? '#ffffff' : '#f9fafb';

  return (
    <tr className="workload-grid-row">
      {/* Member info column - Fixed width, conditionally sticky */}
      <td 
        className="workload-grid-cell member-cell"
        style={{
          backgroundColor: rowBgColor,
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: shouldCenterAlign ? 'static' : 'sticky',
          left: shouldCenterAlign ? 'auto' : '0',
          zIndex: shouldCenterAlign ? 'auto' : 20,
          textAlign: 'left',
          padding: '12px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.3)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
          verticalAlign: 'middle'
        }}
      >
        <div className="member-info">
          <Avatar className="member-avatar">
            <AvatarImage src={getAvatarUrl(member)} alt={displayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: '1', minWidth: '0' }}>
            <span className="member-name">
              {displayName}
            </span>
            {'isPending' in member && member.isPending && (
              <span style={{ 
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '8px'
              }}>
                Pending
              </span>
            )}
          </div>
        </div>
      </td>
      
      {/* Week allocation cells */}
      {weekStartDates.map((week) => {
        const weekData = memberWeeklyData[week.key];
        const weekTotal = weekData?.total || 0;
        
        const getUtilizationColor = (hours: number) => {
          if (hours === 0) return '#f3f4f6';
          if (hours <= 20) return '#10b981';
          if (hours <= 40) return '#f59e0b';
          return '#ef4444';
        };

        return (
          <td 
            key={week.key} 
            className="workload-grid-cell week-cell"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: rowBgColor,
              textAlign: 'center',
              padding: '2px',
              borderRight: '1px solid rgba(156, 163, 175, 0.2)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
              verticalAlign: 'middle'
            }}
          >
            {weekTotal > 0 ? (
              <div 
                className="utilization-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  backgroundColor: getUtilizationColor(weekTotal),
                  color: 'white',
                  cursor: 'help'
                }}
                title={`${weekTotal}h allocated`}
              >
                {weekTotal}
              </div>
            ) : (
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
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

      {/* Total hours column */}
      <td 
        className="workload-grid-cell total-cell"
        style={{ 
          width: '120px', 
          minWidth: '120px',
          maxWidth: '120px',
          backgroundColor: '#f8fafc',
          textAlign: 'center',
          padding: '12px 8px',
          borderRight: 'none',
          borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
          verticalAlign: 'middle',
          fontWeight: '600'
        }}
      >
        <span style={{ 
          fontSize: '14px',
          fontWeight: '700',
          color: totalHours > 0 ? '#1f2937' : '#9ca3af'
        }}>
          {totalHours}h
        </span>
      </td>
    </tr>
  );
};
