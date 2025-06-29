
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
            className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold text-white cursor-help transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: weekHours >= weeklyCapacity ? '#ef4444' : weekHours >= weeklyCapacity * 0.8 ? '#f97316' : '#3b82f6'
            }}
          >
            {weekHours}
          </div>
        </WorkloadTooltip>
      ) : (
        <div className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-medium text-gray-400 bg-gray-100">
          0
        </div>
      )}
    </td>
  );
};
