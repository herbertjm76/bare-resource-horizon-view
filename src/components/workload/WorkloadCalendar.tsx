
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, eachWeekOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
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
  // Get all weeks in the selected month
  const weeksInMonth = eachWeekOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  }, { weekStartsOn: 1 }); // Start weeks on Monday

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
  
  // Helper to aggregate daily data into weekly totals
  const getWeeklyBreakdown = (memberId: string, weekStart: Date): WorkloadBreakdown => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    let weeklyBreakdown: WorkloadBreakdown = {
      projectHours: 0,
      annualLeave: 0,
      officeHolidays: 0,
      otherLeave: 0,
      total: 0
    };
    
    daysInWeek.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dailyBreakdown = workloadData[memberId]?.[dateKey];
      
      if (dailyBreakdown) {
        weeklyBreakdown.projectHours += dailyBreakdown.projectHours;
        weeklyBreakdown.annualLeave += dailyBreakdown.annualLeave;
        weeklyBreakdown.officeHolidays += dailyBreakdown.officeHolidays;
        weeklyBreakdown.otherLeave += dailyBreakdown.otherLeave;
        weeklyBreakdown.total += dailyBreakdown.total;
      }
    });
    
    return weeklyBreakdown;
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
    
    // Calculate weekly utilization percentage
    const weeklyCapacity = member.weekly_capacity || 40;
    const utilizationPercentage = Math.round((breakdown.total / weeklyCapacity) * 100);
    
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
    const weeklyCapacity = member.weekly_capacity || 40;
    const utilizationPercentage = breakdown.total > 0 ? Math.round((breakdown.total / weeklyCapacity) * 100) : 0;
    
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
              {weeksInMonth.map(weekStart => {
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'd')}`;
                
                return (
                  <TableHead 
                    key={weekStart.toString()} 
                    className="p-0 text-center min-w-[120px] border-l"
                  >
                    <div className="flex flex-col items-center text-xs py-2 px-3">
                      <span className="font-medium">{weekLabel}</span>
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
                  {weeksInMonth.map(weekStart => {
                    const weeklyBreakdown = getWeeklyBreakdown(member.id, weekStart);
                    const { style, displayText } = getCellStyleAndPercentage(weeklyBreakdown, member);
                    const hoverData = formatBreakdownHover(weeklyBreakdown, member);
                    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                    
                    return (
                      <HoverCard key={`${member.id}-${weekStart.toString()}`}>
                        <HoverCardTrigger asChild>
                          <TableCell 
                            className={`p-0 text-center cursor-help border-l ${style}`}
                          >
                            {displayText}
                          </TableCell>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="w-64 p-0">
                          <div className="bg-white rounded-lg border shadow-lg p-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                              Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Utilization:</span>
                                <span className="text-sm font-semibold text-gray-900">{hoverData.utilization}%</span>
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
