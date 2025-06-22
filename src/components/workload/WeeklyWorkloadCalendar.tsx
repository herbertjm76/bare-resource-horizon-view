
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from './hooks/useWeeklyWorkloadData';
import { WorkloadTooltip } from './WorkloadTooltip';
import { Badge } from '@/components/ui/badge';

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
              
              {weekStartDates.map((week) => (
                <TableHead 
                  key={week.key} 
                  className="text-center min-w-[120px] max-w-[120px] p-0"
                  style={{ backgroundColor: '#6465F0', color: 'white' }}
                >
                  <div className="flex flex-col items-center px-1 py-1">
                    <span className="text-xs font-medium text-white">
                      Week of
                    </span>
                    <span className="text-xs text-white">
                      {format(week.date, 'MMM d')}
                    </span>
                  </div>
                </TableHead>
              ))}
              
              <TableHead className="text-center min-w-[100px] total-column p-0" style={{ backgroundColor: '#6465F0', color: 'white' }}>
                <div className="px-2 py-1">Total Utilization</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {members.map((member, memberIndex) => {
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
                <TableRow key={member.id} className={`member-row h-7 ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                  <TableCell className="sticky left-0 z-10 bg-inherit p-0">
                    <div className="flex items-center gap-2 px-2 py-1">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback style={{ backgroundColor: '#6F4BF6', color: 'white' }} className="text-xs rounded-md">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {member.first_name} {member.last_name}
                      </span>
                    </div>
                  </TableCell>
                  
                  {weekStartDates.map((week) => {
                    const weekData = memberWeeklyData[week.key];
                    const weekHours = weekData?.total || 0;
                    
                    return (
                      <TableCell 
                        key={week.key}
                        className="text-center p-0"
                        style={{ maxWidth: '120px', width: '120px' }}
                      >
                        <div className="px-0.5 py-0.5 flex justify-center">
                          {weekHours > 0 && weekData && (
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
                              <div className={`workload-pill text-sm font-semibold px-2 py-1 rounded-md cursor-help ${getWorkloadPillClass(weekHours, weeklyCapacity)}`}>
                                {weekHours}h
                              </div>
                            </WorkloadTooltip>
                          )}
                          {weekHours === 0 && (
                            <div className="workload-pill text-sm font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-400">
                              0h
                            </div>
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
