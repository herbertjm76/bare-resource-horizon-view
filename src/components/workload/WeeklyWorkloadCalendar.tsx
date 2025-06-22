import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from './hooks/useWeeklyWorkloadData';
import { WorkloadTooltip } from './WorkloadTooltip';
import './workload-grid.css';

interface WeeklyWorkloadCalendarProps {
  members: TeamMember[];
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  weekStartDates: Array<{ date: Date; key: string }>;
}

export const WeeklyWorkloadCalendar: React.FC<WeeklyWorkloadCalendarProps> = ({
  members,
  weeklyWorkloadData,
  weekStartDates
}) => {
  // Helper to get user initials
  const getUserInitials = (member: TeamMember): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: TeamMember): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  // Get workload intensity class for pill styling
  const getWorkloadPillClass = (hours: number, capacity: number) => {
    if (!hours) return 'workload-pill empty';
    const percentage = (hours / capacity) * 100;
    if (percentage >= 100) return 'workload-pill bg-red-500';
    if (percentage >= 80) return 'workload-pill bg-orange-500';
    return 'workload-pill bg-blue-500';
  };

  // Get utilization badge class
  const getUtilizationBadgeClass = (percent: number) => {
    if (percent > 100) return 'utilization-badge high';
    if (percent >= 80) return 'utilization-badge medium';
    return 'utilization-badge low';
  };

  return (
    <TooltipProvider>
      <div className="workload-grid-container">
        <table className="workload-grid-table">
          <thead>
            <tr>
              <th className="workload-grid-header member-column">
                Team Member
              </th>
              
              {weekStartDates.map((week) => (
                <th 
                  key={week.key} 
                  className="workload-grid-header week-column"
                >
                  <div>
                    {format(week.date, 'MMM d')}
                  </div>
                </th>
              ))}
              
              <th className="workload-grid-header total-column">
                Total Utilization
              </th>
            </tr>
          </thead>
          
          <tbody>
            {members.map((member) => {
              const memberWeeklyData = weeklyWorkloadData[member.id] || {};
              const weeklyCapacity = member.weekly_capacity || 40;
              
              // Calculate total hours across all weeks
              const totalHours = weekStartDates.reduce((sum, week) => {
                const weekData = memberWeeklyData[week.key];
                return sum + (weekData?.total || 0);
              }, 0);
              
              const totalCapacity = weeklyCapacity * weekStartDates.length;
              const utilizationPercent = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
              
              return (
                <tr key={member.id} className="workload-grid-row">
                  <td className="workload-grid-cell member-cell">
                    <div className="member-info">
                      <Avatar className="member-avatar">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="member-name">
                        {member.first_name} {member.last_name}
                      </span>
                    </div>
                  </td>
                  
                  {weekStartDates.map((week) => {
                    const weekData = memberWeeklyData[week.key];
                    const weekHours = weekData?.total || 0;
                    
                    return (
                      <td 
                        key={week.key}
                        className="workload-grid-cell week-cell"
                      >
                        {weekHours > 0 && weekData ? (
                          <WorkloadTooltip
                            breakdown={{
                              projectHours: weekData.projectHours,
                              annualLeave: weekData.annualLeave,
                              officeHolidays: weekData.officeHolidays,
                              otherLeave: weekData.otherLeave,
                              total: weekData.total
                            }}
                            memberName={`${member.first_name} ${member.last_name}`}
                            date={format(week.date, 'MMM d, yyyy')}
                          >
                            <div className={getWorkloadPillClass(weekHours, weeklyCapacity)}>
                              {weekHours}h
                            </div>
                          </WorkloadTooltip>
                        ) : (
                          <div className="workload-pill empty">
                            0h
                          </div>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className="workload-grid-cell total-cell">
                    <div className={getUtilizationBadgeClass(utilizationPercent)}>
                      {utilizationPercent}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};
