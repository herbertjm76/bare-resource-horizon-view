import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WorkloadCalendarProps {
  members: TeamMember[];
  selectedWeek: Date;
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  periodToShow?: number;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  members,
  selectedWeek,
  workloadData,
  periodToShow = 12
}) => {
  // Generate weeks based on the period to show
  const weeks = Array.from({ length: periodToShow }, (_, i) => {
    return addWeeks(startOfWeek(selectedWeek, { weekStartsOn: 1 }), i);
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

  // Helper to calculate utilization and get enhanced styling
  const getEnhancedCellData = (breakdown: WorkloadBreakdown | undefined, member: TeamMember) => {
    if (!breakdown || breakdown.total === 0) {
      return { 
        utilization: 0,
        displayText: '',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-400',
        progressValue: 0,
        status: 'empty' as const,
        availableHours: member.weekly_capacity || 40
      };
    }
    
    const weeklyCapacity = member.weekly_capacity || 40;
    const utilization = Math.round((breakdown.total / weeklyCapacity) * 100);
    const availableHours = Math.max(0, weeklyCapacity - breakdown.total);
    
    let bgColor = '';
    let textColor = '';
    let status: 'low' | 'good' | 'high' | 'over' = 'good';
    
    if (utilization <= 49) {
      bgColor = 'bg-red-50';
      textColor = 'text-red-700';
      status = 'low';
    } else if (utilization <= 99) {
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-700';
      status = 'good';
    } else if (utilization <= 120) {
      bgColor = 'bg-green-50';
      textColor = 'text-green-700';
      status = 'high';
    } else {
      bgColor = 'bg-orange-50';
      textColor = 'text-orange-700';
      status = 'over';
    }
    
    return { 
      utilization,
      displayText: utilization.toString(),
      bgColor,
      textColor,
      progressValue: Math.min(utilization, 100),
      status,
      availableHours
    };
  };
  
  // Calculate total for each member across the period
  const getTotalForPeriod = (memberId: string): WorkloadBreakdown => {
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
      breakdown,
      capacity: weeklyCapacity,
      available: Math.max(0, weeklyCapacity - breakdown.total)
    };
  };

  // Get status icon for trends
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return <TrendingDown className="h-3 w-3" />;
      case 'high': 
      case 'over': return <TrendingUp className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-card shadow-sm">
        <div className="workload-grid-container">
          <div className="workload-calendar min-w-fit">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-b-2">
                  <TableHead className="sticky left-0 bg-background z-10 min-w-[140px] border-r-2 font-semibold">
                    Team Member
                  </TableHead>
                  {weeks.map(weekStart => {
                    const weekLabel = format(weekStart, 'MMM d');
                    
                    return (
                      <TableHead 
                        key={weekStart.toString()} 
                        className="p-0 text-center w-[60px] border-l font-semibold relative"
                      >
                        <div className="h-16 flex items-center justify-center">
                          <div 
                            className="transform -rotate-90 whitespace-nowrap text-xs font-medium"
                            style={{ transformOrigin: 'center' }}
                          >
                            {weekLabel}
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                  <TableHead className="p-0 text-center w-[90px] border-l font-semibold">
                    Available
                  </TableHead>
                  <TableHead className="p-0 text-center w-16 border-l font-semibold">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMembers.map((member, rowIndex) => {
                  const totalForPeriod = getTotalForPeriod(member.id);
                  const totalCapacity = (member.weekly_capacity || 40) * periodToShow;
                  const totalAvailable = Math.max(0, totalCapacity - totalForPeriod.total);
                  
                  return (
                    <TableRow key={member.id} className="hover:bg-muted/30">
                      <TableCell 
                        className="whitespace-nowrap font-medium sticky left-0 z-10 p-2 border-r-2" 
                        style={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : 'rgba(0,0,0,0.02)' }}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{getMemberName(member)}</span>
                          <span className="text-xs text-muted-foreground">{member.job_title}</span>
                        </div>
                      </TableCell>
                      {weeks.map(weekStart => {
                        const weeklyBreakdown = getWeeklyBreakdown(member.id, weekStart);
                        const cellData = getEnhancedCellData(weeklyBreakdown, member);
                        const hoverData = formatBreakdownHover(weeklyBreakdown, member);
                        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                        
                        return (
                          <HoverCard key={`${member.id}-${weekStart.toString()}`}>
                            <HoverCardTrigger asChild>
                              <TableCell 
                                className={`p-1 text-center cursor-help border-l relative h-16 w-[60px] ${cellData.bgColor}`}
                              >
                                <div className="flex flex-col items-center justify-center h-full space-y-1">
                                  <div className={`flex items-center justify-center text-xs font-medium ${cellData.textColor}`}>
                                    {cellData.utilization > 0 && (
                                      <>
                                        {getStatusIcon(cellData.status)}
                                        <span className="ml-1">{cellData.utilization}%</span>
                                      </>
                                    )}
                                  </div>
                                  {cellData.utilization > 0 && (
                                    <Progress 
                                      value={cellData.progressValue} 
                                      className="h-1 w-8"
                                      indicatorClassName={
                                        cellData.status === 'low' ? 'bg-red-500' :
                                        cellData.status === 'good' ? 'bg-blue-500' :
                                        cellData.status === 'high' ? 'bg-green-500' : 'bg-orange-500'
                                      }
                                    />
                                  )}
                                </div>
                              </TableCell>
                            </HoverCardTrigger>
                            <HoverCardContent side="top" className="w-64 p-0">
                              <div className="bg-white rounded-lg border shadow-lg p-4">
                                <div className="text-sm font-medium text-gray-900 mb-3">
                                  Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                                </div>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Utilization:</span>
                                    <Badge variant="outline" className="text-xs">
                                      {hoverData.utilization}%
                                    </Badge>
                                  </div>
                                  <div className="border-t pt-2 space-y-2">
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
                                  </div>
                                  <div className="border-t pt-2 space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-gray-900 font-medium">Total Hours:</span>
                                      <span className="font-semibold">{Math.round(hoverData.breakdown.total * 10) / 10}h</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-green-600">Available:</span>
                                      <span className="font-medium text-green-600">{Math.round(hoverData.available * 10) / 10}h</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-gray-500">Capacity:</span>
                                      <span className="text-gray-500">{hoverData.capacity}h</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        );
                      })}
                      <TableCell className="p-2 text-center border-l">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-green-600">
                            {Math.round(totalAvailable * 10) / 10}h
                          </span>
                          <span className="text-xs text-muted-foreground">
                            / {totalCapacity}h
                          </span>
                        </div>
                      </TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <TableCell className="p-2 text-center border-l font-medium cursor-help">
                            {Math.round(totalForPeriod.total * 10) / 10}h
                          </TableCell>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="w-64 p-0">
                          <div className="bg-white rounded-lg border shadow-lg p-4">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                              {periodToShow}-Week Total
                            </div>
                            <div className="space-y-1">
                              {totalForPeriod.projectHours > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-blue-600">Project Hours:</span>
                                  <span className="font-medium">{Math.round(totalForPeriod.projectHours * 10) / 10}h</span>
                                </div>
                              )}
                              {totalForPeriod.annualLeave > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-orange-600">Annual Leave:</span>
                                  <span className="font-medium">{Math.round(totalForPeriod.annualLeave * 10) / 10}h</span>
                                </div>
                              )}
                              {totalForPeriod.officeHolidays > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-purple-600">Holidays:</span>
                                  <span className="font-medium">{Math.round(totalForPeriod.officeHolidays * 10) / 10}h</span>
                                </div>
                              )}
                              {totalForPeriod.otherLeave > 0 && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-600">Other Leave:</span>
                                  <span className="font-medium">{Math.round(totalForPeriod.otherLeave * 10) / 10}h</span>
                                </div>
                              )}
                              <div className="border-t pt-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-900 font-medium">Total:</span>
                                  <span className="font-semibold">{Math.round(totalForPeriod.total * 10) / 10}h</span>
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
      </div>
    </div>
  );
};
