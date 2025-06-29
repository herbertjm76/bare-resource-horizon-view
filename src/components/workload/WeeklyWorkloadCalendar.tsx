
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from './hooks/useWeeklyWorkloadData';
import { WorkloadCalendarTable } from './components/WorkloadCalendarTable';
import './workload-grid.css';

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
  // Debug logging for workload calculation
  console.log('WeeklyWorkloadCalendar - Data Summary:', {
    membersCount: members.length,
    weeksCount: weekStartDates.length,
    sampleMemberData: Object.keys(weeklyWorkloadData).slice(0, 3),
    sampleWeekData: weekStartDates.slice(0, 2).map(week => ({
      week: week.key,
      date: format(week.date, 'yyyy-MM-dd'),
      membersWithData: Object.keys(weeklyWorkloadData).filter(memberId => 
        weeklyWorkloadData[memberId]?.[week.key]?.total > 0
      ).length
    }))
  });

  return (
    <TooltipProvider>
      <WorkloadCalendarTable
        members={members}
        weeklyWorkloadData={weeklyWorkloadData}
        weekStartDates={weekStartDates}
      />
    </TooltipProvider>
  );
};
