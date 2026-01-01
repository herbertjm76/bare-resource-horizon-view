
import React from 'react';
import { format } from 'date-fns';
import { WorkloadTooltip } from '../WorkloadTooltip';
import { WeeklyWorkloadBreakdown } from '../hooks/types';

interface WorkloadCalendarCellProps {
  week: { date: Date; key: string };
  weekData: WeeklyWorkloadBreakdown | undefined;
  memberName: string;
  weeklyCapacity: number;
}

export const WorkloadCalendarCell: React.FC<WorkloadCalendarCellProps> = ({
  week,
  weekData,
  memberName,
  weeklyCapacity
}) => {
  const weekHours = weekData?.total || 0;
  const weekDateString = format(week.date, 'MMM d, yyyy');
  
  // Color-coding based on utilization percentage
  const getUtilizationColor = (hours: number) => {
    if (hours === 0) {
      return '#f3f4f6'; // Gray for 0 hours
    }
    const utilization = (hours / weeklyCapacity) * 100;
    if (utilization > 100) {
      return '#ef4444'; // Red for over-allocated
    } else if (utilization >= 80) {
      return '#22c55e'; // Green for 80-100% (optimal)
    } else if (utilization >= 50) {
      return '#eab308'; // Yellow for 50-79% (moderate)
    } else {
      return '#f97316'; // Orange for below 50% (underutilized)
    }
  };

  // Text color based on background for better contrast
  const getTextColor = (hours: number) => {
    if (hours === 0) {
      return '#9ca3af'; // Gray text for 0 hours
    }
    return '#ffffff'; // White text for all other cases
  };
  
  return (
    <td 
      key={week.key}
      className="workload-grid-cell week-cell text-center border-r border-gray-200"
      style={{ 
        width: '30px', 
        minWidth: '30px',
        padding: '2px'
      }}
    >
      {weekHours > 0 && weekData ? (
        <WorkloadTooltip
          breakdown={{
            projectHours: weekData.projectHours,
            annualLeave: weekData.annualLeave,
            officeHolidays: weekData.officeHolidays,
            otherLeave: weekData.otherLeave,
            total: weekData.total,
            projects: weekData.projects || []
          }}
          memberName={memberName}
          date={weekDateString}
        >
          <div 
            className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold cursor-help transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: getUtilizationColor(weekHours),
              color: getTextColor(weekHours)
            }}
          >
            {weekHours}
          </div>
        </WorkloadTooltip>
      ) : (
        <div 
          className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium"
          style={{
            backgroundColor: getUtilizationColor(0),
            color: getTextColor(0)
          }}
        >
          0
        </div>
      )}
    </td>
  );
};
