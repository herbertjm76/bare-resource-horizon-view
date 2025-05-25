
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkloadCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  members,
  selectedMonth,
  workloadData
}) => {
  // Get all days in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  // Sort members by name
  const sortedMembers = [...members].sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
    return nameA.localeCompare(nameB);
  });
  
  // Helper to get the name for a member
  const getMemberName = (member: TeamMember) => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };
  
  // Custom day formatter for minimal day representation with unique identifiers
  const getMinimalDayLabel = (day: Date): string => {
    const dayOfWeek = day.getDay();
    switch(dayOfWeek) {
      case 0: return 'Su';
      case 1: return 'M';
      case 2: return 'Tu';
      case 3: return 'W';
      case 4: return 'Th';
      case 5: return 'F';
      case 6: return 'Sa';
      default: return '';
    }
  };

  // Helper to calculate utilization percentage and determine cell styling
  const getCellStyleAndPercentage = (breakdown: WorkloadBreakdown | undefined, member: TeamMember) => {
    if (!breakdown || breakdown.total === 0) {
      return { 
        style: 'bg-gray-200 text-gray-600', 
        percentage: 0,
        displayText: ''
      };
    }
    
    // Calculate daily capacity (weekly capacity / 5 working days)
    const dailyCapacity = (member.weekly_capacity || 40) / 5;
    const utilizationPercentage = Math.round((breakdown.total / dailyCapacity) * 100);
    
    let style = '';
    let displayText = `${utilizationPercentage}%`;
    
    if (utilizationPercentage === 0) {
      style = 'bg-gray-200 text-gray-600';
      displayText = '';
    } else if (utilizationPercentage >= 1 && utilizationPercentage <= 49) {
      style = 'bg-pink-300 text-pink-900 font-medium'; // Magenta
    } else if (utilizationPercentage >= 50 && utilizationPercentage <= 99) {
      style = 'bg-purple-500 text-white font-medium'; // Purple
    } else if (utilizationPercentage >= 100) {
      style = 'bg-green-500 text-white font-medium'; // Green
    }
    
    return { 
      style, 
      percentage: utilizationPercentage,
      displayText
    };
  };
  
  // Helper to check if the cell should have a thick border (Sunday-Monday separator)
  const isSundayBorder = (day: Date): boolean => {
    return day.getDay() === 0;
  };
  
  // Calculate monthly total for each member
  const getMonthlyTotal = (memberId: string): WorkloadBreakdown => {
    if (!workloadData[memberId]) return { projectHours: 0, annualLeave: 0, officeHolidays: 0, otherLeave: 0, total: 0 };
    
    return Object.values(workloadData[memberId]).reduce((acc, breakdown) => ({
      projectHours: acc.projectHours + breakdown.projectHours,
      annualLeave: acc.annualLeave + breakdown.annualLeave,
      officeHolidays: acc.officeHolidays + breakdown.officeHolidays,
      otherLeave: acc.otherLeave + breakdown.otherLeave,
      total: acc.total + breakdown.total
    }), { projectHours: 0, annualLeave: 0, officeHolidays: 0, otherLeave: 0, total: 0 });
  };

  // Format breakdown for tooltip
  const formatBreakdownTooltip = (breakdown: WorkloadBreakdown): string => {
    const parts = [];
    if (breakdown.projectHours > 0) parts.push(`Project: ${Math.round(breakdown.projectHours * 10) / 10}h`);
    if (breakdown.annualLeave > 0) parts.push(`Annual Leave: ${Math.round(breakdown.annualLeave * 10) / 10}h`);
    if (breakdown.officeHolidays > 0) parts.push(`Holiday: ${Math.round(breakdown.officeHolidays * 10) / 10}h`);
    if (breakdown.otherLeave > 0) parts.push(`Other Leave: ${Math.round(breakdown.otherLeave * 10) / 10}h`);
    return parts.join('\n') || 'No hours allocated';
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="overflow-x-auto annual-leave-calendar">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10 min-w-[180px] border-r">Member</TableHead>
                {daysInMonth.map(day => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const dayNumber = format(day, 'd');
                  const dayLabel = getMinimalDayLabel(day);
                  const isSundayCol = isSundayBorder(day);
                  
                  return (
                    <TableHead 
                      key={day.toString()} 
                      className={`p-0 text-center w-8 ${isWeekend ? 'bg-muted/60' : ''} ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} ${isSundayCol ? 'sunday-border' : ''}`}
                      aria-label={format(day, 'EEEE')}
                    >
                      <div className="flex flex-col items-center text-xs py-1 px-2">
                        <span className={`text-muted-foreground ${isWeekend ? 'font-medium' : ''}`}>{dayLabel}</span>
                        <span className={`${isWeekend ? 'font-bold' : 'font-medium'}`}>{dayNumber}</span>
                      </div>
                    </TableHead>
                  );
                })}
                <TableHead className="p-0 text-center w-16 border-l">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMembers.map((member, rowIndex) => {
                const monthlyTotal = getMonthlyTotal(member.id);
                
                return (
                  <TableRow key={member.id}>
                    <TableCell 
                      className="whitespace-nowrap font-medium sticky left-0 z-10 p-1.5 border-r" 
                      style={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : 'rgba(0,0,0,0.07)' }}
                    >
                      {getMemberName(member)}
                    </TableCell>
                    {daysInMonth.map(day => {
                      const dateKey = format(day, 'yyyy-MM-dd');
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      const breakdown = workloadData[member.id]?.[dateKey];
                      const isSundayCol = isSundayBorder(day);
                      
                      const { style, displayText } = getCellStyleAndPercentage(breakdown, member);
                      
                      return (
                        <Tooltip key={`${member.id}-${dateKey}`}>
                          <TooltipTrigger asChild>
                            <TableCell 
                              className={`p-0 text-center cursor-help ${isWeekend ? 'bg-muted/60' : ''} 
                                ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} 
                                ${isSundayCol ? 'sunday-border' : ''}
                                ${style}`}
                            >
                              {displayText}
                            </TableCell>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="whitespace-pre-line">
                            <div className="text-sm">
                              <div className="font-medium">{format(day, 'MMM d, yyyy')}</div>
                              <div className="mt-1">{formatBreakdownTooltip(breakdown || { projectHours: 0, annualLeave: 0, officeHolidays: 0, otherLeave: 0, total: 0 })}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className="p-1 text-center border-l font-medium cursor-help">
                          {Math.round(monthlyTotal.total * 10) / 10}h
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="whitespace-pre-line">
                        <div className="text-sm">
                          <div className="font-medium">Monthly Total</div>
                          <div className="mt-1">{formatBreakdownTooltip(monthlyTotal)}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
