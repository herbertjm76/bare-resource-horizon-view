
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

  // Debug logging for workload calculation
  console.log('WeeklyWorkloadCalendar - Data Summary:', {
    membersCount: members.length,
    weeksCount: weekStartDates.length,
    sampleMemberData: Object.keys(weeklyWorkloadData).slice(0, 3),
    sampleWeekData: weekStartDates.slice(0, 2).map(week => ({
      week: week.key,
      date: format(week.date, 'yyyy-MM-dd'),
      membersWithData: Object.keys(weeklyWorkloadData).filter(memberId => 
        weeklyWorkloadData[memberId]?.[week.key]?.total > 0
      ).length
    }))
  });

  return (
    <TooltipProvider>
      <div className="workload-grid-container">
        <table 
          className="workload-grid-table enhanced-resource-table" 
          style={{
            minWidth: `${200 + (weekStartDates.length * 30) + 100}px`,
            width: '100%'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#6465F0' }}>
              {/* Team Member column */}
              <th 
                className="workload-grid-header member-column sticky-left-0 z-20"
                style={{ backgroundColor: '#6465F0' }}
              >
                Team Member
              </th>
              
              {/* Week columns - matching Project Resourcing format */}
              {weekStartDates.map((week, index) => {
                const isFirstOfMonth = week.date.getDate() <= 7;
                const isNewMonth = index === 0 || weekStartDates[index - 1].date.getMonth() !== week.date.getMonth();
                
                return (
                  <th 
                    key={week.key}
                    className="workload-grid-header week-column text-center text-xs font-semibold text-white py-2 px-1 relative"
                    style={{ 
                      width: '30px', 
                      minWidth: '30px',
                      backgroundColor: '#6465F0',
                      borderLeft: isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
                    }}
                  >
                    <div className="flex flex-col items-center h-full">
                      {isNewMonth ? (
                        <>
                          <span className="text-[10px] font-bold uppercase leading-none text-yellow-200 mb-1">
                            {format(week.date, 'MMM')}
                          </span>
                          <div className="flex flex-col items-center justify-end gap-0.5 flex-1">
                            <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                              W
                            </span>
                            <span className="text-sm font-bold leading-none">
                              {format(week.date, 'd')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-end gap-0.5 h-full pt-4">
                          <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                            W
                          </span>
                          <span className="text-sm font-bold leading-none">
                            {format(week.date, 'd')}
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              
              {/* Total Utilization column */}
              <th 
                className="workload-grid-header total-column"
                style={{ backgroundColor: '#7c3aed' }}
              >
                Total Utilization
              </th>
            </tr>
          </thead>
          
          <tbody>
            {members.map((member, memberIndex) => {
              const memberWeeklyData = weeklyWorkloadData[member.id] || {};
              const weeklyCapacity = member.weekly_capacity || 40;
              const memberDisplayName = getMemberDisplayName(member);
              
              // Calculate total hours across all weeks
              const totalHours = weekStartDates.reduce((sum, week) => {
                const weekData = memberWeeklyData[week.key];
                return sum + (weekData?.total || 0);
              }, 0);
              
              const totalCapacity = weeklyCapacity * weekStartDates.length;
              const utilizationPercent = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;

              // Debug logging for specific member
              if (memberDisplayName.toLowerCase().includes('paul')) {
                console.log(`Workload data for ${memberDisplayName}:`, {
                  memberWeeklyData,
                  totalHours,
                  weeklyCapacity,
                  sampleWeekData: weekStartDates.slice(0, 3).map(week => ({
                    week: week.key,
                    date: format(week.date, 'MMM d'),
                    data: memberWeeklyData[week.key]
                  }))
                });
              }
              
              return (
                <tr 
                  key={member.id} 
                  className={`workload-grid-row ${memberIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
                >
                  <td className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300">
                    <div className="member-info">
                      <Avatar className="member-avatar">
                        <AvatarImage src={getAvatarUrl(member)} alt={memberDisplayName} />
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
                    const weekDateString = format(week.date, 'MMM d, yyyy');
                    
                    return (
                      <td 
                        key={week.key}
                        className="workload-grid-cell week-cell text-center border-r border-gray-200"
                        style={{ 
                          width: '30px', 
                          minWidth: '30px',
                          padding: '2px'
                        }}
                      >
                        {weekHours > 0 && weekData ? (
                          <WorkloadTooltip
                            breakdown={{
                              projectHours: weekData.projectHours,
                              annualLeave: weekData.annualLeave,
                              officeHolidays: weekData.officeHolidays,
                              otherLeave: weekData.otherLeave,
                              total: weekData.total,
                              projects: weekData.projects || []
                            }}
                            memberName={memberDisplayName}
                            date={weekDateString}
                          >
                            <div 
                              className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold text-white cursor-help transition-all duration-200 hover:scale-110"
                              style={{
                                backgroundColor: weekHours >= weeklyCapacity ? '#ef4444' : weekHours >= weeklyCapacity * 0.8 ? '#f97316' : '#3b82f6'
                              }}
                            >
                              {weekHours}
                            </div>
                          </WorkloadTooltip>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium text-gray-400 bg-gray-100">
                            0
                          </div>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className="workload-grid-cell total-cell bg-gray-50 font-semibold">
                    <div className={`utilization-badge ${utilizationPercent > 100 ? 'high' : utilizationPercent >= 80 ? 'medium' : 'low'}`}>
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
