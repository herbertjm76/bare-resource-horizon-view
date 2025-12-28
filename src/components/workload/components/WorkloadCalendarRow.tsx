import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { MemberInfoCell } from './MemberInfoCell';
import { WeekUtilizationCell } from './WeekUtilizationCell';
import { TotalHoursCell } from './TotalHoursCell';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface WorkloadCalendarRowProps {
  member: TeamMember;
  memberIndex: number;
  weekStartDates: Array<{ date: Date; key: string }>;
  memberWeeklyData: Record<string, WeeklyWorkloadBreakdown>;
  shouldCenterAlign?: boolean;
}

export const WorkloadCalendarRow: React.FC<WorkloadCalendarRowProps> = ({
  member,
  memberIndex,
  weekStartDates,
  memberWeeklyData,
  shouldCenterAlign = false
}) => {
  const { workWeekHours } = useAppSettings();
  // Calculate total hours across all weeks for this member
  const totalHours = weekStartDates.reduce((total, week) => {
    const weekData = memberWeeklyData[week.key];
    return total + (weekData?.total || 0);
  }, 0);

  // Calculate total capacity for the period
  const weeklyCapacity = getMemberCapacity(member.weekly_capacity, workWeekHours);
  const periodWeeks = weekStartDates.length;

  return (
    <TooltipProvider>
      <tr className="workload-grid-row">
        <MemberInfoCell 
          member={member} 
          memberIndex={memberIndex} 
          shouldCenterAlign={shouldCenterAlign} 
        />
        
        {weekStartDates.map((week) => {
          const weekData = memberWeeklyData[week.key];
          return (
            <WeekUtilizationCell
              key={week.key}
              week={week}
              weekData={weekData}
              memberIndex={memberIndex}
            />
          );
        })}

        <TotalHoursCell 
          totalHours={totalHours} 
          weeklyCapacity={weeklyCapacity}
          periodWeeks={periodWeeks}
        />
      </tr>
    </TooltipProvider>
  );
};
