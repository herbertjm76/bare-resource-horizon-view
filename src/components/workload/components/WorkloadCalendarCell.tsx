
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
  
  // Color-coding based on utilization levels
  const getUtilizationColor = (hours: number) => {
    if (hours === 0) {
      return '#f3f4f6'; // Gray for 0 hours
    } else if (hours < 10) {
      return '#3b82f6'; // Blue for single digit hours (underutilized)
    } else if (hours === 40) {
      return '#22c55e'; // Green for exactly 40 hours (fully utilized)
    } else if (hours > 40) {
      return '#ef4444'; // Red for over 40 hours (over capacity)
    } else {
      return '#3b82f6'; // Blue for 10-39 hours (moderate utilization)
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
