
import React, { useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { format, addDays, startOfWeek, isSunday, isToday } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { Badge } from '@/components/ui/badge';

interface WorkloadCalendarProps {
  members: TeamMember[];
  selectedWeek: Date;
  workloadData: Record<string, WorkloadBreakdown>;
  periodToShow: number;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  members,
  selectedWeek,
  workloadData,
  periodToShow
}) => {
  // Generate date range for the period
  const dateRange = useMemo(() => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const dates = [];
    
    for (let i = 0; i < periodToShow * 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    
    return dates;
  }, [selectedWeek, periodToShow]);

  // Get workload intensity class
  const getWorkloadClass = (hours: number, capacity: number) => {
    if (!hours) return '';
    const percentage = (hours / capacity) * 100;
    if (percentage >= 100) return 'workload-high';
    if (percentage >= 80) return 'workload-medium';
    return 'workload-low';
  };

  return (
    <Table className="enhanced-table">
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 z-20 bg-inherit min-w-[200px]">
            Team Member
          </TableHead>
          
          {dateRange.map((date) => (
            <TableHead 
              key={date.toISOString()} 
              className={`text-center min-w-[60px] ${isSunday(date) ? 'sunday-border' : ''} ${isToday(date) ? 'bg-blue-50' : ''}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">
                  {format(date, 'EEE')}
                </span>
                <span className="text-xs text-gray-500">
                  {format(date, 'd')}
                </span>
              </div>
            </TableHead>
          ))}
          
          <TableHead className="text-center min-w-[80px] total-column">
            Total
          </TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {members.map((member) => {
          const memberWorkload = workloadData[member.id];
          const weeklyCapacity = member.weekly_capacity || 40;
          const dailyCapacity = weeklyCapacity / 5; // Assuming 5 working days
          
          // Calculate total hours for the period
          const totalHours = dateRange.reduce((sum, date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            return sum + (memberWorkload?.daily[dateStr]?.totalHours || 0);
          }, 0);
          
          const utilizationPercent = weeklyCapacity > 0 ? Math.round((totalHours / (weeklyCapacity * periodToShow)) * 100) : 0;
          
          return (
            <TableRow key={member.id} className="member-row">
              <TableCell className="sticky left-0 z-10 bg-inherit">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {member.first_name} {member.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {member.department || 'N/A'}
                  </span>
                </div>
              </TableCell>
              
              {dateRange.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayData = memberWorkload?.daily[dateStr];
                const dayHours = dayData?.totalHours || 0;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                
                return (
                  <TableCell 
                    key={date.toISOString()}
                    className={`text-center workload-cell ${getWorkloadClass(dayHours, dailyCapacity)} ${
                      isSunday(date) ? 'sunday-border' : ''
                    } ${isWeekend ? 'weekend' : ''} ${isToday(date) ? 'bg-blue-50' : ''}`}
                  >
                    {dayHours > 0 && (
                      <div className="enhanced-pill text-xs">
                        {dayHours}h
                      </div>
                    )}
                  </TableCell>
                );
              })}
              
              <TableCell className="text-center total-column">
                <div className="flex flex-col items-center gap-1">
                  <div className="enhanced-pill">
                    {totalHours}h
                  </div>
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
  );
};
