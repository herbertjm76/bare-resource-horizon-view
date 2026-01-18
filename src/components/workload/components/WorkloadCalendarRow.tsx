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
  
  // Check if member is overutilized in any week (>100%)
  const isAtRisk = weekStartDates.some((week) => {
    const weekData = memberWeeklyData[week.key];
    if (!weekData) return false;
    const utilization = (weekData.total / weeklyCapacity) * 100;
    return utilization > 100;
  });

  // Theme-based alternating row colors
  const rowBgColor = memberIndex % 2 === 0 
    ? 'hsl(var(--background))' 
    : 'hsl(var(--theme-primary) / 0.02)';

  return (
    <TooltipProvider>
      <tr 
        className="workload-grid-row workload-grid-row-compact transition-colors" 
        style={{ 
          height: '28px', 
          minHeight: '28px',
          backgroundColor: rowBgColor
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
      >
        <MemberInfoCell 
          member={member} 
          memberIndex={memberIndex} 
          shouldCenterAlign={shouldCenterAlign}
          isAtRisk={isAtRisk}
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
