
import React, { useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { format, addDays, startOfWeek, isSunday, isToday } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/types';
import { Badge } from '@/components/ui/badge';

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
  // Generate date range for the period
  const dateRange = useMemo(() => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const dates = [];
    
    for (let i = 0; i < periodToShow * 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    
    return dates;
  }, [selectedWeek, periodToShow]);

  // Get workload intensity class for pill styling
  const getWorkloadPillClass = (hours: number, capacity: number) => {
    if (!hours) return 'bg-gray-100 text-gray-600';
    const percentage = (hours / capacity) * 100;
    if (percentage >= 100) return 'bg-red-500 text-white';
    if (percentage >= 80) return 'bg-orange-500 text-white';
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="workload-grid-container">
      <Table className="enhanced-table workload-calendar">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-20 bg-inherit min-w-[200px]">
              Team Member
            </TableHead>
            
            {dateRange.map((date) => (
              <TableHead 
                key={date.toISOString()} 
                className={`text-center min-w-[60px] ${isSunday(date) ? 'sunday-border' : ''} ${isToday(date) ? 'bg-blue-100' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${isToday(date) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-xs bg-white text-gray-700 px-2 py-1 rounded mt-1">
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
          {members.map((member, memberIndex) => {
            const memberWorkloadDays = workloadData[member.id] || {};
            const weeklyCapacity = member.weekly_capacity || 40;
            const dailyCapacity = weeklyCapacity / 5; // Assuming 5 working days
            
            // Calculate total hours for the period
            const totalHours = dateRange.reduce((sum, date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = memberWorkloadDays[dateStr];
              return sum + (dayData?.total || 0);
            }, 0);
            
            const utilizationPercent = weeklyCapacity > 0 ? Math.round((totalHours / (weeklyCapacity * periodToShow)) * 100) : 0;
            
            return (
              <TableRow key={member.id} className={`member-row ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
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
                  const dayData = memberWorkloadDays[dateStr];
                  const dayHours = dayData?.total || 0;
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <TableCell 
                      key={date.toISOString()}
                      className={`text-center ${
                        isSunday(date) ? 'sunday-border' : ''
                      } ${isWeekend ? 'weekend' : ''} ${isToday(date) ? 'bg-blue-100' : ''}`}
                    >
                      {dayHours > 0 && (
                        <div className={`workload-pill text-xs font-medium px-2 py-1 rounded-full ${getWorkloadPillClass(dayHours, dailyCapacity)}`}>
                          {dayHours}
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
    </div>
  );
};
