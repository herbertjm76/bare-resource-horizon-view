import React from 'react';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface WorkloadTooltipProps {
  weekData: WeeklyWorkloadBreakdown | undefined;
  weeklyCapacity?: number;
}

export const WorkloadTooltip: React.FC<WorkloadTooltipProps> = ({ weekData, weeklyCapacity }) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = weeklyCapacity || workWeekHours;
  
  if (!weekData || weekData.total === 0) {
    return <div>No allocation for this week</div>;
  }

  return (
    <div className="space-y-2">
      <div className="font-semibold text-sm text-foreground">Week Breakdown</div>
      
      {/* Project hours breakdown */}
      {weekData.projectHours > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-foreground">Project Hours:</span>
            <span className="text-muted-foreground">{formatAllocationValue(weekData.projectHours, capacity, displayPreference)}</span>
          </div>
          
          {/* Show projects if available */}
          {'projects' in weekData && weekData.projects && weekData.projects.length > 0 && (
            <div className="ml-2 space-y-1">
              {weekData.projects.map((project, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span 
                    className="font-medium text-foreground truncate max-w-[120px]"
                    title={getProjectTooltip({ code: project.project_code, name: project.project_name })}
                  >
                    {getProjectAbbreviation({ code: project.project_code, name: project.project_name })}
                  </span>
                  <span className="text-muted-foreground">{formatAllocationValue(project.hours, capacity, displayPreference)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other time breakdown */}
      {(weekData.annualLeave > 0 || weekData.otherLeave > 0 || weekData.officeHolidays > 0) && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Other Time:</div>
          {weekData.annualLeave > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Leave</span>
              <span className="text-muted-foreground">{formatAllocationValue(weekData.annualLeave, capacity, displayPreference)}</span>
            </div>
          )}
          {weekData.otherLeave > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Other Leave</span>
              <span className="text-muted-foreground">{formatAllocationValue(weekData.otherLeave, capacity, displayPreference)}</span>
            </div>
          )}
          {weekData.officeHolidays > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Office Holidays</span>
              <span className="text-muted-foreground">{formatAllocationValue(weekData.officeHolidays, capacity, displayPreference)}</span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-border pt-1">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{formatAllocationValue(weekData.total, capacity, displayPreference)}</span>
        </div>
      </div>
    </div>
  );
};
