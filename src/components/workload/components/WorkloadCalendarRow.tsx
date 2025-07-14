import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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

  // Helper function to render tooltip content for week data
  const renderWeekTooltip = (weekData: WeeklyWorkloadBreakdown | undefined) => {
    console.log('🔍 TOOLTIP DEBUG:', { 
      weekData, 
      hasWeekData: !!weekData,
      weekTotal: weekData?.total,
      projectHours: weekData?.projectHours,
      projects: weekData?.projects
    });
    
    if (!weekData || weekData.total === 0) {
      return <div>No allocation for this week</div>;
    }

    return (
      <div className="space-y-2">
        <div className="font-semibold text-sm text-foreground">Week Breakdown</div>
        
        {/* Project hours breakdown */}
        {weekData.projectHours > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-foreground">Project Hours:</span>
              <span className="text-muted-foreground">{weekData.projectHours}h</span>
            </div>
            
            {/* Show projects if available */}
            {'projects' in weekData && weekData.projects && weekData.projects.length > 0 && (
              <div className="ml-2 space-y-1">
                {weekData.projects.map((project, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground truncate max-w-[120px]">
                      {project.project_code || project.project_name}
                    </span>
                    <span className="text-muted-foreground">{project.hours}h</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other time breakdown */}
        {(weekData.annualLeave > 0 || weekData.otherLeave > 0 || weekData.officeHolidays > 0) && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Other Time:</div>
            {weekData.annualLeave > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground">Annual Leave</span>
                <span className="text-muted-foreground">{weekData.annualLeave}h</span>
              </div>
            )}
            {weekData.otherLeave > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground">Other Leave</span>
                <span className="text-muted-foreground">{weekData.otherLeave}h</span>
              </div>
            )}
            {weekData.officeHolidays > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground">Office Holidays</span>
                <span className="text-muted-foreground">{weekData.officeHolidays}h</span>
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="border-t border-border pt-1">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{weekData.total}h</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
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
        
        console.log('🔍 WEEK CELL DEBUG:', {
          weekKey: week.key,
          weekData,
          weekTotal,
          hasData: !!weekData
        });
        
        const getUtilizationColor = (hours: number) => {
          if (hours === 0) return '#f3f4f6';
          if (hours === 40) return '#22c55e';
          if (hours > 40) return '#ef4444';
          return '#eab308';
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
              <Tooltip>
                <TooltipTrigger asChild>
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
                  >
                    {weekTotal}
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-xs bg-popover border shadow-lg p-3"
                  side="top"
                  align="center"
                >
                  {renderWeekTooltip(weekData)}
                </TooltipContent>
              </Tooltip>
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
    </TooltipProvider>
  );
};
