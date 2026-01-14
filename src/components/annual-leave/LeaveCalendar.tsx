import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, addDays, subDays, addMonths, eachDayOfInterval, getDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { LeaveDataByDate } from '@/hooks/useAnnualLeave';
import { TimeRange } from './MonthSelector';
import { EditLeaveCalendarDialog } from './EditLeaveCalendarDialog';

interface LeaveCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
  leaveDetails?: Record<string, Record<string, LeaveDataByDate>>;
  timeRange: TimeRange;
  isAdmin?: boolean;
  onLeaveChange?: (memberId: string, date: string, hours: number, leaveTypeId?: string) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  members,
  selectedMonth,
  leaveData,
  leaveDetails,
  timeRange,
  isAdmin = false,
  onLeaveChange
}) => {
  // State for edit dialog
  const [editingCell, setEditingCell] = useState<{
    member: TeamMember;
    date: string;
    hours: number;
    leaveTypeId?: string;
  } | null>(null);
  // Calculate date range based on time range selection
  const today = new Date();
  
  const getDateRange = () => {
    switch (timeRange) {
      case 'week':
        // Show current week with +3 and -3 days buffer
        return {
          start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 3),
          end: addDays(endOfWeek(today, { weekStartsOn: 1 }), 3)
        };
      case 'month':
        // Show the entire current month with +3 and -3 days buffer
        return {
          start: subDays(startOfMonth(today), 3),
          end: addDays(endOfMonth(today), 3)
        };
      case 'quarter':
        // Show the entire current quarter
        return {
          start: startOfQuarter(today),
          end: endOfQuarter(today)
        };
      case 'year':
        // Show the entire current year
        return {
          start: startOfYear(today),
          end: endOfYear(today)
        };
      default:
        return {
          start: startOfMonth(selectedMonth),
          end: endOfMonth(selectedMonth)
        };
    }
  };
  
  const { start: startDate, end: endDate } = getDateRange();
  
  // Generate all days in the range
  const days = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    return {
      day: date.getDate(),
      date: format(date, 'yyyy-MM-dd'),
      month: format(date, 'MMM'),
      dayOfWeek,
      isWeekend,
      isSunday: dayOfWeek === 0,
      isToday,
      formattedDate: format(date, 'MMM d, yyyy'),
      dayName: format(date, 'EEE').charAt(0),
      isNewMonth: date.getDate() === 1
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

  // Get the primary leave type color for a day (use the first entry's color)
  const getLeaveTypeColor = (memberId: string, date: string): string => {
    const details = leaveDetails?.[memberId]?.[date];
    if (details?.entries && details.entries.length > 0) {
      return details.entries[0].leave_type_color;
    }
    return '#3B82F6'; // Default primary blue
  };

  const getMemberTotalHours = (memberId: string): number => {
    const memberLeave = leaveData[memberId] || {};
    // Only count hours within the visible date range
    return days.reduce((sum, day) => {
      return sum + (memberLeave[day.date] || 0);
    }, 0);
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
              {days.map((day, idx) => (
                <th 
                  key={day.date} 
                  className={`
                    w-8 min-w-8 text-center font-medium px-0.5 py-1.5
                    ${day.isWeekend ? 'bg-muted/50 text-muted-foreground' : 'text-foreground'}
                    ${day.isSunday ? 'border-l-2 border-border' : ''}
                    ${day.isToday ? 'bg-primary/10' : ''}
                    ${day.isNewMonth && idx > 0 ? 'border-l-2 border-primary/30' : ''}
                  `}
                >
                  <div className="flex flex-col items-center leading-tight">
                    {day.isNewMonth && idx > 0 && (
                      <span className="text-[8px] text-primary font-semibold">{day.month}</span>
                    )}
                    <span className="text-[10px] opacity-60">{day.dayName}</span>
                    <span className={`text-xs font-semibold ${day.isToday ? 'text-primary' : ''}`}>
                      {day.day}
                    </span>
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
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground truncate max-w-28">
                        {member.first_name} {member.last_name?.charAt(0)}.
                      </span>
                    </div>
                  </td>
                  {days.map((day, idx) => {
                    const hours = memberLeaveData[day.date] || 0;
                    const details = memberLeaveDetails[day.date];
                    const hasLeave = hours > 0;
                    const fullDay = isFullDay(hours);
                    const firstLeaveTypeId = details?.entries?.[0]?.leave_type_id;
                    
                    const handleCellClick = () => {
                      if (isAdmin && onLeaveChange) {
                        setEditingCell({
                          member,
                          date: day.date,
                          hours,
                          leaveTypeId: firstLeaveTypeId
                        });
                      }
                    };
                    
                    return (
                      <td 
                        key={day.date} 
                        className={`
                          text-center p-0.5 h-8
                          ${day.isWeekend ? 'bg-muted/30' : ''}
                          ${day.isSunday ? 'border-l-2 border-border' : ''}
                          ${day.isToday ? 'bg-primary/5' : ''}
                          ${day.isNewMonth && idx > 0 ? 'border-l-2 border-primary/30' : ''}
                          ${isAdmin ? 'cursor-pointer hover:bg-primary/10 transition-colors' : ''}
                        `}
                        onClick={handleCellClick}
                      >
                      {hasLeave ? (
                          <HoverCard openDelay={100} closeDelay={50}>
                            <HoverCardTrigger asChild>
                              <div 
                                className={`w-7 h-6 mx-auto rounded flex items-center justify-center text-sm font-bold transition-transform leading-none hover:scale-110 hover:shadow-md ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                                style={{ 
                                  backgroundColor: getLeaveTypeColor(member.id, day.date),
                                  opacity: fullDay ? 1 : 0.5,
                                  color: 'white'
                                }}
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
                              <div 
                                className="p-2.5"
                                style={{ backgroundColor: getLeaveTypeColor(member.id, day.date) }}
                              >
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
                                
                                {isAdmin && (
                                  <div className="border-t border-border pt-2">
                                    <p className="text-xs text-primary font-medium text-center">Click to edit</p>
                                  </div>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ) : (
                          <div className={`w-7 h-6 mx-auto rounded ${isAdmin ? 'hover:bg-muted/50' : ''}`} />
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
      
      {/* Edit Leave Dialog */}
      <EditLeaveCalendarDialog
        open={!!editingCell}
        onOpenChange={(open) => !open && setEditingCell(null)}
        member={editingCell?.member || null}
        date={editingCell?.date || ''}
        currentHours={editingCell?.hours || 0}
        currentLeaveTypeId={editingCell?.leaveTypeId}
        onSave={(memberId, date, hours, leaveTypeId) => {
          if (onLeaveChange) {
            onLeaveChange(memberId, date, hours, leaveTypeId);
          }
        }}
      />
    </div>
  );
};
