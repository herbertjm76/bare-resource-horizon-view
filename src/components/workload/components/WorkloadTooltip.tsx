import React from 'react';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';

interface WorkloadTooltipProps {
  weekData: WeeklyWorkloadBreakdown | undefined;
}

export const WorkloadTooltip: React.FC<WorkloadTooltipProps> = ({ weekData }) => {
  const { projectDisplayPreference } = useAppSettings();
  
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
            <span className="text-muted-foreground">{weekData.projectHours}h</span>
          </div>
          
          {/* Show projects if available */}
          {'projects' in weekData && weekData.projects && weekData.projects.length > 0 && (
            <div className="ml-2 space-y-1">
              {weekData.projects.map((project, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground truncate max-w-[120px]">
                    {getProjectDisplayName({ code: project.project_code, name: project.project_name }, projectDisplayPreference)}
                  </span>
                  <span className="text-muted-foreground">{project.hours}h</span>
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
              <span className="text-foreground">Annual Leave</span>
              <span className="text-muted-foreground">{weekData.annualLeave}h</span>
            </div>
          )}
          {weekData.otherLeave > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Other Leave</span>
              <span className="text-muted-foreground">{weekData.otherLeave}h</span>
            </div>
          )}
          {weekData.officeHolidays > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-foreground">Office Holidays</span>
              <span className="text-muted-foreground">{weekData.officeHolidays}h</span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-border pt-1">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{weekData.total}h</span>
        </div>
      </div>
    </div>
  );
};
