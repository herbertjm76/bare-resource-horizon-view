import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

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
      dayName: format(date, 'EEEEE') // Single letter day name
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
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-grey">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 w-36 min-w-36 max-w-36 bg-card text-left px-2 py-1.5 font-medium text-foreground text-xs">
                Name
              </th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    w-7 min-w-7 max-w-7 text-center font-medium px-0 py-1 text-[10px]
                    ${day.isWeekend ? 'bg-muted/40 text-muted-foreground' : 'text-foreground'}
                    ${day.isSunday ? 'border-l border-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center leading-tight">
                    <span className="opacity-60">{day.dayName}</span>
                    <span className="font-semibold">{day.day}</span>
                  </div>
                </th>
              ))}
              <th className="w-12 min-w-12 bg-card text-center px-1 py-1.5 font-medium text-[10px] text-muted-foreground border-l border-border">
                Total
              </th>
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
                    group hover:bg-muted/20 transition-colors
                    ${memberIndex % 2 === 0 ? 'bg-background' : 'bg-muted/5'}
                  `}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-2 py-1 border-r border-border">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-gradient-modern text-white text-[8px] font-medium">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground truncate max-w-24">
                        {member.first_name} {member.last_name?.charAt(0)}.
                      </span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const hours = memberLeaveData[day.date] || 0;
                    const hasLeave = hours > 0;
                    const fullDay = isFullDay(hours);
                    
                    return (
                      <td 
                        key={day.date} 
                        className={`
                          text-center p-0 h-7
                          ${day.isWeekend ? 'bg-muted/30' : ''}
                          ${day.isSunday ? 'border-l border-border' : ''}
                        `}
                      >
                        {hasLeave ? (
                          <HoverCard openDelay={100} closeDelay={50}>
                            <HoverCardTrigger asChild>
                              <div 
                                className={`
                                  w-6 h-5 mx-auto rounded flex items-center justify-center
                                  text-[9px] font-semibold cursor-default transition-transform
                                  hover:scale-110
                                  ${fullDay 
                                    ? 'bg-gradient-modern text-white' 
                                    : 'bg-primary/30 text-primary-foreground'
                                  }
                                `}
                              >
                                {hours}
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent 
                              className="w-56 p-0 overflow-hidden z-[100] bg-popover border border-border shadow-lg" 
                              side="top" 
                              align="center"
                              sideOffset={5}
                            >
                              <div className="bg-gradient-modern p-2">
                                <div className="flex items-center gap-1.5 text-white">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium text-xs">{day.formattedDate}</span>
                                </div>
                              </div>
                              <div className="p-2 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={getAvatarUrl(member)} />
                                    <AvatarFallback className="bg-gradient-modern text-white text-[8px]">
                                      {getUserInitials(member)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-xs text-foreground">
                                      {getMemberDisplayName(member)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-border">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[10px]">Duration</span>
                                  </div>
                                  <Badge 
                                    variant={fullDay ? "default" : "secondary"}
                                    className={`text-[10px] px-1.5 py-0 ${fullDay ? "bg-gradient-modern" : ""}`}
                                  >
                                    {hours}h ({fullDay ? 'Full' : 'Half'})
                                  </Badge>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div className="w-6 h-5 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center px-1 py-1 border-l border-border">
                    {totalHours > 0 ? (
                      <Badge 
                        variant="secondary" 
                        className="text-[9px] px-1 py-0 bg-primary/10 text-primary font-semibold"
                      >
                        {totalHours}h
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Compact Legend */}
      <div className="flex items-center justify-end gap-3 mt-2 px-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-modern" />
          <span className="text-muted-foreground">Full Day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/30" />
          <span className="text-muted-foreground">Half Day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted/40" />
          <span className="text-muted-foreground">Weekend</span>
        </div>
      </div>
    </div>
  );
};
