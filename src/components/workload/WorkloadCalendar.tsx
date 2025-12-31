
import React, { useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format, addDays, startOfWeek, isSunday, isToday } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/types';
import { WorkloadTooltip } from './WorkloadTooltip';
import { Badge } from '@/components/ui/badge';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { logger } from '@/utils/logger';

interface WorkloadCalendarProps {
  members: TeamMember[];
  selectedWeek: Date;
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  periodToShow: number;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  members,
  selectedWeek,
  workloadData,
  periodToShow
}) => {
  const { workWeekHours } = useAppSettings();
  // Generate date range for the period
  const dateRange = useMemo(() => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const dates = [];
    
    for (let i = 0; i < periodToShow * 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    
    return dates;
  }, [selectedWeek, periodToShow]);

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
    if (!hours) return 'bg-gray-100 text-gray-600';
    const percentage = (hours / capacity) * 100;
    if (percentage >= 100) return 'bg-red-500 text-white';
    if (percentage >= 80) return 'bg-orange-500 text-white';
    return 'bg-blue-500 text-white';
  };

  return (
    <TooltipProvider>
      <div className="workload-grid-container">
        <Table className="enhanced-table workload-calendar">
          <TableHeader>
            <TableRow className="h-6" style={{ backgroundColor: '#6465F0' }}>
              <TableHead className="sticky left-0 z-20 bg-inherit min-w-[180px] p-0" style={{ backgroundColor: '#6465F0', color: 'white' }}>
                <div className="px-2 py-1">Team Member</div>
              </TableHead>
              
              {dateRange.map((date) => (
                <TableHead 
                  key={date.toISOString()} 
                  className={`text-center min-w-[40px] max-w-[40px] p-0 ${isSunday(date) ? 'sunday-border' : ''} ${isToday(date) ? 'bg-blue-100' : ''}`}
                  style={{ backgroundColor: isToday(date) ? '#dbeafe' : '#6465F0', color: isToday(date) ? 'black' : 'white' }}
                >
                  <div className="flex flex-col items-center px-1 py-1">
                    <span className={`text-xs font-medium ${isToday(date) ? 'text-black font-bold' : 'text-white'}`}>
                      {format(date, 'EEE')}
                    </span>
                    <span className={`text-xs ${isToday(date) ? 'text-black font-bold' : 'text-white'}`}>
                      {format(date, 'd')}
                    </span>
                  </div>
                </TableHead>
              ))}
              
              <TableHead className="text-center min-w-[70px] total-column p-0" style={{ backgroundColor: '#6465F0', color: 'white' }}>
                <div className="px-2 py-1">Utilization</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {members.map((member, memberIndex) => {
              const memberWorkloadDays = workloadData[member.id] || {};
              const weeklyCapacity = getMemberCapacity(member.weekly_capacity, workWeekHours);
              const dailyCapacity = weeklyCapacity / 5; // Assuming 5 working days
              
              // Calculate total hours for the period
              const totalHours = dateRange.reduce((sum, date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayData = memberWorkloadDays[dateStr];
                return sum + (dayData?.total || 0);
              }, 0);
              
              const utilizationPercent = weeklyCapacity > 0 ? Math.round((totalHours / (weeklyCapacity * periodToShow)) * 100) : 0;
              
              // Debug logging for Paul Julius
              if (member.first_name === 'Paul' && member.last_name === 'Julius') {
                logger.debug('🔍 WORKLOAD CALENDAR: Paul Julius data:', {
                  memberId: member.id,
                  workloadDays: memberWorkloadDays,
                  totalHours,
                  weeklyCapacity,
                  utilizationPercent,
                  periodToShow
                });
              }
              
              return (
                <TableRow key={member.id} className={`member-row h-7 ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                  <TableCell className="sticky left-0 z-10 bg-inherit p-0">
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback style={{ backgroundColor: '#6F4BF6', color: 'white' }} className="text-xs">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {member.first_name} {member.last_name}
                      </span>
                    </div>
                  </TableCell>
                  
                  {dateRange.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const dayData = memberWorkloadDays[dateStr];
                    const dayHours = dayData?.total || 0;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    // Debug logging for Paul Julius on specific date
                    if (member.first_name === 'Paul' && member.last_name === 'Julius' && dateStr === '2025-05-26') {
                      logger.debug(`🔍 WORKLOAD CALENDAR: Paul Julius on ${dateStr}:`, {
                        dayData,
                        dayHours,
                        dateStr
                      });
                    }
                    
                    return (
                      <TableCell 
                        key={date.toISOString()}
                        className={`text-center p-0 ${
                          isSunday(date) ? 'sunday-border' : ''
                        } ${isWeekend ? 'weekend' : ''} ${isToday(date) ? 'bg-blue-100' : ''}`}
                        style={{ maxWidth: '40px', width: '40px' }}
                      >
                        <div className="px-0.5 py-0.5 flex justify-center">
                          {dayHours > 0 && dayData && (
                            <WorkloadTooltip
                              breakdown={dayData}
                              memberName={`${member.first_name} ${member.last_name}`}
                              date={format(date, 'MMM d, yyyy')}
                            >
                              <div className={`workload-pill text-xs font-semibold px-1.5 py-0.5 rounded-full cursor-help ${getWorkloadPillClass(dayHours, dailyCapacity)}`}>
                                {dayHours}
                              </div>
                            </WorkloadTooltip>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                  
                  <TableCell className="text-center total-column p-0">
                    <div className="flex justify-center px-2 py-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          utilizationPercent > 100 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : utilizationPercent >= 80 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {utilizationPercent}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};
