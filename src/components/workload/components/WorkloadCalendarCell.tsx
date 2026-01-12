
import React from 'react';
import { format } from 'date-fns';
import { WorkloadTooltip } from '../WorkloadTooltip';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { getUtilizationSolidBgColor, getUtilizationSolidTextColor, calculateUtilization } from '@/utils/utilizationColors';

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
  const utilization = calculateUtilization(weekHours, weeklyCapacity);
  
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
              backgroundColor: getUtilizationSolidBgColor(utilization),
              color: getUtilizationSolidTextColor(utilization)
            }}
          >
            {weekHours}
          </div>
        </WorkloadTooltip>
      ) : (
        <div 
          className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium"
          style={{
            backgroundColor: getUtilizationSolidBgColor(0),
            color: getUtilizationSolidTextColor(0)
          }}
        >
          0
        </div>
      )}
    </td>
  );
};
