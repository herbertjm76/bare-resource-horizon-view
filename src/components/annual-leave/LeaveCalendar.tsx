import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';

interface LeaveEntry {
  date: string;
  hours: number;
  leave_type?: string;
  leave_type_color?: string;
  is_full_day?: boolean;
}

interface LeaveCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
  leaveDetails?: Record<string, Record<string, LeaveEntry[]>>;
  onLeaveChange?: (memberId: string, date: string, hours: number) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  members,
  selectedMonth,
  leaveData,
  leaveDetails
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
      isSunday: dayOfWeek === 0,
      formattedDate: format(date, 'MMM d, yyyy')
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

  // Helper to determine if it's a full day based on hours
  const isFullDay = (hours: number): boolean => hours >= 8;

  // Calculate total hours for a member in the month
  const getMemberTotalHours = (memberId: string): number => {
    const memberLeave = leaveData[memberId] || {};
    return Object.values(memberLeave).reduce((sum, hours) => sum + hours, 0);
  };

  if (members.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No team members to display
      </div>
    );
  }

  return (
    <div className="annual-leave-grid-container">
      <div className="enhanced-table-container overflow-x-auto scrollbar-grey">
        <table className="enhanced-table w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 min-w-56 bg-card text-left px-4 py-3 font-semibold text-sm text-foreground border-r border-border">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Team Member
                </div>
              </th>
              <th className="sticky left-56 z-20 min-w-16 bg-card text-center px-2 py-3 font-semibold text-xs text-muted-foreground border-r border-border">
                Total
              </th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    min-w-10 text-center text-xs font-medium px-1 py-2 transition-colors
                    ${day.isWeekend ? 'bg-muted/50 text-muted-foreground' : 'text-foreground'}
                    ${day.isSunday ? 'border-l-2 border-l-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] uppercase tracking-wide opacity-70">
                      {format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day.day), 'EEE')}
                    </span>
                    <span className="text-xs font-semibold">{day.day}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, memberIndex) => {
              const memberLeaveData = leaveData[member.id] || {};
              const totalHours = getMemberTotalHours(member.id);
              
              return (
                <tr 
                  key={member.id} 
                  className={`
                    group transition-colors hover:bg-muted/30
                    ${memberIndex % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                  `}
                >
                  <td className="sticky left-0 z-10 bg-inherit border-r border-border px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-gradient-modern text-white text-xs font-medium">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">
                          {member.first_name} {member.last_name}
                        </div>
                        {member.job_title && (
                          <div className="text-xs text-muted-foreground truncate">
                            {member.job_title}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="sticky left-56 z-10 bg-inherit border-r border-border text-center px-2 py-2.5">
                    {totalHours > 0 ? (
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {totalHours}h
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  {days.map((day) => {
                    const hours = memberLeaveData[day.date] || 0;
                    const hasLeave = hours > 0;
                    const fullDay = isFullDay(hours);
                    
                    return (
                      <td 
                        key={day.date} 
                        className={`
                          text-center p-0.5 transition-colors
                          ${day.isWeekend ? 'bg-muted/30' : ''}
                          ${day.isSunday ? 'border-l-2 border-l-border' : ''}
                        `}
                      >
                        {hasLeave ? (
                          <HoverCard openDelay={200} closeDelay={100}>
                            <HoverCardTrigger asChild>
                              <div 
                                className={`
                                  w-9 h-9 mx-auto rounded-lg flex items-center justify-center
                                  text-xs font-semibold cursor-default transition-all
                                  hover:scale-110 hover:shadow-md
                                  ${fullDay 
                                    ? 'bg-gradient-modern text-white shadow-sm' 
                                    : 'bg-gradient-to-br from-primary/40 to-primary/60 text-primary-foreground'
                                  }
                                `}
                                style={{
                                  opacity: fullDay ? 1 : 0.75
                                }}
                              >
                                {hours}h
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent 
                              className="w-64 p-0 overflow-hidden" 
                              side="top" 
                              align="center"
                            >
                              <div className="bg-gradient-modern p-3">
                                <div className="flex items-center gap-2 text-white">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-medium text-sm">{day.formattedDate}</span>
                                </div>
                              </div>
                              <div className="p-3 space-y-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={getAvatarUrl(member)} />
                                    <AvatarFallback className="bg-gradient-modern text-white text-xs">
                                      {getUserInitials(member)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm text-foreground">
                                      {getMemberDisplayName(member)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {member.job_title || 'Team Member'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-xs">Duration</span>
                                  </div>
                                  <Badge 
                                    variant={fullDay ? "default" : "secondary"}
                                    className={fullDay ? "bg-gradient-modern" : ""}
                                  >
                                    {hours} hours ({fullDay ? 'Full Day' : 'Half Day'})
                                  </Badge>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div className={`
                            w-9 h-9 mx-auto rounded-lg
                            ${day.isWeekend ? '' : 'group-hover:bg-muted/50'}
                            transition-colors
                          `} />
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
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mt-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-modern shadow-sm" />
          <span className="text-xs text-muted-foreground">Full Day (8h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-primary/40 to-primary/60 opacity-75" />
          <span className="text-xs text-muted-foreground">Half Day (4h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/50 border border-border" />
          <span className="text-xs text-muted-foreground">Weekend</span>
        </div>
      </div>
    </div>
  );
};
