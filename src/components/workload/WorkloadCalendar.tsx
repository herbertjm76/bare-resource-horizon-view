
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
        style: 'bg-gray-100 text-gray-500', 
        percentage: 0,
        displayText: ''
      };
    }
    
    // Calculate daily capacity (weekly capacity / 5 working days)
    const dailyCapacity = (member.weekly_capacity || 40) / 5;
    const utilizationPercentage = Math.round((breakdown.total / dailyCapacity) * 100);
    
    let style = '';
    let displayText = `${utilizationPercentage}`;
    
    if (utilizationPercentage === 0) {
      style = 'bg-gray-100 text-gray-500';
      displayText = '';
    } else if (utilizationPercentage >= 1 && utilizationPercentage <= 49) {
      style = 'bg-red-100 text-red-800 font-medium'; // Light red for underutilized
    } else if (utilizationPercentage >= 50 && utilizationPercentage <= 99) {
      style = 'bg-blue-100 text-blue-800 font-medium'; // Light blue for good utilization
    } else if (utilizationPercentage >= 100) {
      style = 'bg-green-100 text-green-800 font-medium'; // Light green for full/over utilization
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

  // Format breakdown for hover card
  const formatBreakdownHover = (breakdown: WorkloadBreakdown, member: TeamMember) => {
    const dailyCapacity = (member.weekly_capacity || 40) / 5;
    const utilizationPercentage = breakdown.total > 0 ? Math.round((breakdown.total / dailyCapacity) * 100) : 0;
    
    return {
      utilization: utilizationPercentage,
      breakdown
    };
  };
  
  return (
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
                    const hoverData = formatBreakdownHover(breakdown || { projectHours: 0, annualLeave: 0, officeHolidays: 0, otherLeave: 0, total: 0 }, member);
                    
                    return (
                      <HoverCard key={`${member.id}-${dateKey}`}>
                        <HoverCardTrigger asChild>
                          <TableCell 
                            className={`p-0 text-center cursor-help ${isWeekend ? 'bg-muted/60' : ''} 
                              ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} 
                              ${isSundayCol ? 'sunday-border' : ''}
                              ${style}`}
                          >
                            {displayText}
                          </TableCell>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="w-64 p-0">
                          <div className="bg-white rounded-lg border shadow-lg p-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                              {format(day, 'MMM d, yyyy')}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Utilization:</span>
                                <span className="text-sm font-semibold text-gray-900">{hoverData.utilization}</span>
                              </div>
                              <div className="border-t pt-2 space-y-1">
                                {hoverData.breakdown.projectHours > 0 && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-blue-600">Project Hours:</span>
                                    <span className="font-medium">{Math.round(hoverData.breakdown.projectHours * 10) / 10}h</span>
                                  </div>
                                )}
                                {hoverData.breakdown.annualLeave > 0 && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-orange-600">Annual Leave:</span>
                                    <span className="font-medium">{Math.round(hoverData.breakdown.annualLeave * 10) / 10}h</span>
                                  </div>
                                )}
                                {hoverData.breakdown.officeHolidays > 0 && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-purple-600">Holidays:</span>
                                    <span className="font-medium">{Math.round(hoverData.breakdown.officeHolidays * 10) / 10}h</span>
                                  </div>
                                )}
                                {hoverData.breakdown.otherLeave > 0 && (
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">Other Leave:</span>
                                    <span className="font-medium">{Math.round(hoverData.breakdown.otherLeave * 10) / 10}h</span>
                                  </div>
                                )}
                                {hoverData.breakdown.total === 0 && (
                                  <div className="text-xs text-gray-500 italic">No hours allocated</div>
                                )}
                              </div>
                              {hoverData.breakdown.total > 0 && (
                                <div className="border-t pt-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-900 font-medium">Total:</span>
                                    <span className="font-semibold">{Math.round(hoverData.breakdown.total * 10) / 10}h</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <TableCell className="p-1 text-center border-l font-medium cursor-help">
                        {Math.round(monthlyTotal.total * 10) / 10}h
                      </TableCell>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" className="w-64 p-0">
                      <div className="bg-white rounded-lg border shadow-lg p-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Monthly Total
                        </div>
                        <div className="space-y-1">
                          {monthlyTotal.projectHours > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-blue-600">Project Hours:</span>
                              <span className="font-medium">{Math.round(monthlyTotal.projectHours * 10) / 10}h</span>
                            </div>
                          )}
                          {monthlyTotal.annualLeave > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-orange-600">Annual Leave:</span>
                              <span className="font-medium">{Math.round(monthlyTotal.annualLeave * 10) / 10}h</span>
                            </div>
                          )}
                          {monthlyTotal.officeHolidays > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-purple-600">Holidays:</span>
                              <span className="font-medium">{Math.round(monthlyTotal.officeHolidays * 10) / 10}h</span>
                            </div>
                          )}
                          {monthlyTotal.otherLeave > 0 && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">Other Leave:</span>
                              <span className="font-medium">{Math.round(monthlyTotal.otherLeave * 10) / 10}h</span>
                            </div>
                          )}
                          <div className="border-t pt-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-900 font-medium">Total:</span>
                              <span className="font-semibold">{Math.round(monthlyTotal.total * 10) / 10}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
