import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth, getDay } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { LeaveDataByDate } from '@/hooks/useAnnualLeave';

interface LeaveCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
  leaveDetails?: Record<string, Record<string, LeaveDataByDate>>;
  onLeaveChange?: (memberId: string, date: string, hours: number) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  members,
  selectedMonth,
  leaveData,
  leaveDetails
}) => {
  const daysInMonth = getDaysInMonth(selectedMonth);
  
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
      formattedDate: format(date, 'MMM d, yyyy'),
      dayName: format(date, 'EEE').charAt(0)
    };
  });

  const getUserInitials = (member: TeamMember): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getMemberDisplayName = (member: TeamMember): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  const isFullDay = (hours: number): boolean => hours >= 8;

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
    <div className="w-full p-3">
      <div className="overflow-x-auto scrollbar-grey">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 w-40 min-w-40 bg-card text-left px-3 py-2 font-semibold text-sm text-foreground">
                Team Member
              </th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    w-8 min-w-8 text-center font-medium px-0.5 py-1.5
                    ${day.isWeekend ? 'bg-muted/50 text-muted-foreground' : 'text-foreground'}
                    ${day.isSunday ? 'border-l-2 border-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-[10px] opacity-60">{day.dayName}</span>
                    <span className="text-xs font-semibold">{day.day}</span>
                  </div>
                </th>
              ))}
              <th className="w-14 min-w-14 bg-card text-center px-2 py-2 font-semibold text-xs text-muted-foreground border-l border-border">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, memberIndex) => {
              const memberLeaveData = leaveData[member.id] || {};
              const memberLeaveDetails = leaveDetails?.[member.id] || {};
              const totalHours = getMemberTotalHours(member.id);
              
              return (
                <tr 
                  key={member.id} 
                  className={`
                    group hover:bg-muted/20 transition-colors
                    ${memberIndex % 2 === 0 ? 'bg-background' : 'bg-muted/5'}
                  `}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-3 py-1.5 border-r border-border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-gradient-modern text-white text-[10px] font-medium">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground truncate max-w-28">
                        {member.first_name} {member.last_name?.charAt(0)}.
                      </span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const hours = memberLeaveData[day.date] || 0;
                    const details = memberLeaveDetails[day.date];
                    const hasLeave = hours > 0;
                    const fullDay = isFullDay(hours);
                    
                    return (
                      <td 
                        key={day.date} 
                        className={`
                          text-center p-0.5 h-8
                          ${day.isWeekend ? 'bg-muted/30' : ''}
                          ${day.isSunday ? 'border-l-2 border-border' : ''}
                        `}
                      >
                        {hasLeave ? (
                          <HoverCard openDelay={100} closeDelay={50}>
                            <HoverCardTrigger asChild>
                              <div 
                                className={`
                                  w-7 h-6 mx-auto rounded flex items-center justify-center
                                  text-[11px] font-bold cursor-default transition-transform
                                  hover:scale-110 hover:shadow-md
                                  ${fullDay 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-primary/50 text-primary-foreground'
                                  }
                                `}
                              >
                                {hours}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent 
                              className="w-64 p-0 overflow-hidden bg-popover border border-border shadow-xl" 
                              side="top" 
                              align="center"
                              sideOffset={8}
                              style={{ zIndex: 9999 }}
                            >
                              <div className="bg-primary p-2.5">
                                <div className="flex items-center gap-2 text-white">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-semibold text-sm">{day.formattedDate}</span>
                                </div>
                              </div>
                              <div className="p-3 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={getAvatarUrl(member)} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-[9px]">
                                      {getUserInitials(member)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-sm text-foreground">
                                      {getMemberDisplayName(member)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {fullDay ? 'Full Day' : 'Half Day'} · {hours}h
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Leave Type Breakdown */}
                                <div className="border-t border-border pt-2 space-y-1.5">
                                  <p className="text-xs font-medium text-muted-foreground mb-2">Leave Breakdown</p>
                                  {details?.entries && details.entries.length > 0 ? (
                                    details.entries.map((entry, idx) => (
                                      <div 
                                        key={idx} 
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div 
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: entry.leave_type_color }}
                                          />
                                          <span className="text-xs text-foreground">{entry.leave_type_name}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                          {entry.hours}h
                                        </Badge>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                                        <span className="text-xs text-foreground">Leave</span>
                                      </div>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {hours}h
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div className="w-7 h-6 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center px-2 py-1.5 border-l border-border">
                    {totalHours > 0 ? (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0 bg-primary/10 text-primary font-bold"
                      >
                        {totalHours}h
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mt-3 px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-primary" />
          <span className="text-muted-foreground">Full Day (8h)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-primary/50" />
          <span className="text-muted-foreground">Half Day (4h)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-muted/50 border border-border" />
          <span className="text-muted-foreground">Weekend</span>
        </div>
      </div>
    </div>
  );
};
