import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeaveCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
  onLeaveChange?: (memberId: string, date: string, hours: number) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  members,
  selectedMonth,
  leaveData
}) => {
  // Generate days for the selected month
  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDayOfMonth = startOfMonth(selectedMonth);
  const firstDayWeekday = getDay(firstDayOfMonth);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return {
      day,
      date: format(date, 'yyyy-MM-dd'),
      dayOfWeek,
      isWeekend,
      isSunday: dayOfWeek === 0
    };
  });

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

  // Helper to get leave cell style based on hours
  const getLeaveCellStyle = (hours: number): string => {
    if (hours === 0) return '';
    if (hours <= 4) return 'bg-primary/40'; // Half day
    return 'bg-primary'; // Full day
  };

  return (
    <TooltipProvider>
      <div className="annual-leave-grid-container">
        <div className="enhanced-table-container">
          <table className="enhanced-table">
            <thead>
              <tr>
                <th className="sticky-left-0 min-w-48 bg-white text-left px-4 py-3">Team Member</th>
                {days.map((day) => (
                  <th 
                    key={day.day} 
                    className={`
                      min-w-12 text-center text-xs font-semibold px-2 py-3
                      ${day.isWeekend ? 'weekend' : ''}
                      ${day.isSunday ? 'sunday-border' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs opacity-80">
                        {format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day.day), 'EEE')}
                      </span>
                      <span className="text-sm font-bold">{day.day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member, memberIndex) => {
                const memberLeaveData = leaveData[member.id] || {};
                
                return (
                  <tr 
                    key={member.id} 
                    className={`
                      member-row
                      ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                    `}
                  >
                    <td className="sticky-left-0 bg-inherit border-r px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                          <AvatarFallback className="bg-gradient-modern text-white text-sm">
                            {getUserInitials(member)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {member.first_name} {member.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    {days.map((day) => {
                      const hours = memberLeaveData[day.date] || 0;
                      const hasLeave = hours > 0;
                      
                      return (
                        <td 
                          key={day.date} 
                          className={`
                            text-center p-1
                            ${day.isWeekend ? 'weekend' : ''}
                            ${day.isSunday ? 'sunday-border' : ''}
                          `}
                        >
                          {hasLeave ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className={`
                                    w-8 h-8 mx-auto rounded-md flex items-center justify-center
                                    text-xs font-medium text-primary-foreground cursor-default
                                    ${getLeaveCellStyle(hours)}
                                  `}
                                >
                                  {hours}h
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{hours} hours of approved leave</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="w-8 h-8 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};
