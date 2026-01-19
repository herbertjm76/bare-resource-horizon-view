
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatUtilizationSummary } from '@/utils/allocationDisplay';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';

interface ProjectBreakdown {
  projectName?: string;
  projectCode?: string;
  projectStage?: string;
  projectFee?: number;
  hours?: number;
  isActive?: boolean;
}

interface EnhancedTooltipProps {
  children: React.ReactNode;
  type: 'utilization' | 'total' | 'project';
  member?: any;
  utilizationPercentage?: number;
  totalUsedHours?: number;
  weeklyCapacity?: number;
  leaveDays?: Array<{ date: string; hours: number }>;
  annualLeave?: number;
  holidayHours?: number;
  projectBreakdown?: ProjectBreakdown | null;
  weekLabel?: string;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  type,
  member,
  utilizationPercentage,
  totalUsedHours,
  weeklyCapacity,
  leaveDays = [],
  annualLeave = 0,
  holidayHours = 0,
  projectBreakdown,
  weekLabel
}) => {
  const { displayPreference, workWeekHours, projectDisplayPreference } = useAppSettings();
  const capacity = weeklyCapacity || workWeekHours;
  
  let content = null;

  switch (type) {
    case 'utilization':
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-brand-secondary">
            {member?.first_name} — Utilization
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div>
              <span className="font-semibold">Utilization:</span> {utilizationPercentage ?? '-'}%
            </div>
            <div>
              <span className="font-semibold">Total Used:</span> {formatUtilizationSummary(totalUsedHours ?? 0, capacity, displayPreference)}
            </div>
            <div>
              <span className="font-semibold">Annual Leave:</span> {formatAllocationValue(annualLeave, capacity, displayPreference)}, <span className="font-semibold">Holiday:</span> {formatAllocationValue(holidayHours, capacity, displayPreference)}
            </div>
            <div className="text-muted-foreground mt-1">
              <span>* Strategic tip:</span> <br />
              {utilizationPercentage && utilizationPercentage > 100
                ? "Overallocation risk! Review project loads or adjust capacity."
                : utilizationPercentage && utilizationPercentage < 60
                ? "Low utilization. Consider re-assigning or rebalancing workload."
                : "Healthy workload distribution this week."}
            </div>
          </div>
        </div>
      );
      break;

    case 'total':
      const otherLeaveHours = (totalUsedHours ?? 0) - annualLeave - holidayHours;
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-brand-secondary">
            Leave Summary
          </div>
          <div className="text-xs space-y-1">
            {annualLeave > 0 && (
              <div>
                <span className="font-semibold">Annual Leave:</span> {formatAllocationValue(annualLeave, capacity, displayPreference)}
              </div>
            )}
            {holidayHours > 0 && (
              <div>
                <span className="font-semibold">Holiday:</span> {formatAllocationValue(holidayHours, capacity, displayPreference)}
              </div>
            )}
            {otherLeaveHours > 0 && (
              <div>
                <span className="font-semibold">Other Leave:</span> {formatAllocationValue(otherLeaveHours, capacity, displayPreference)}
              </div>
            )}
            <div className="border-t border-border pt-1 mt-1">
              <span className="font-semibold">Total:</span> {formatAllocationValue(totalUsedHours ?? 0, capacity, displayPreference)}
            </div>
            {!!leaveDays.length && (
              <div className="mt-2 border-t border-border pt-2">
                <div className="font-semibold mb-1">Dates Out:</div>
                {leaveDays.map((day, i) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <div key={i} className="flex justify-between gap-3">
                      <span>{dayName}, {dateStr}</span>
                      <span className="font-medium">{formatAllocationValue(day.hours, capacity, displayPreference)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
      break;
      
    case 'project':
      // Use abbreviation for display, full tooltip for context
      const projectDisplayText = getProjectAbbreviation(
        { code: projectBreakdown?.projectCode, name: projectBreakdown?.projectName }
      );
      const projectTooltipText = getProjectTooltip(
        { code: projectBreakdown?.projectCode, name: projectBreakdown?.projectName }
      );
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-brand-secondary">
            Project: {projectTooltipText || '-'}
          </div>
          <div className="text-xs space-y-1">
            {/* Show both code and name for context */}
            {projectBreakdown?.projectName && (
              <div>
                <span className="font-semibold">Name:</span> {projectBreakdown.projectName}
              </div>
            )}
            {projectBreakdown?.projectCode && (
              <div>
                <span className="font-semibold">Code:</span> {projectBreakdown.projectCode}
              </div>
            )}
            <div>
              <span className="font-semibold">Stage:</span> {projectBreakdown?.projectStage || '—'}
            </div>
            <div>
              <span className="font-semibold">Fee:</span> {projectBreakdown?.projectFee ? `$${projectBreakdown.projectFee}` : '—'}
            </div>
            <div>
              <span className="font-semibold">Weekly Allocation:</span> {formatAllocationValue(projectBreakdown?.hours ?? 0, capacity, displayPreference)}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {projectBreakdown?.isActive ? "Active" : "Inactive"}
            </div>
            <div className="text-muted-foreground mt-1">
              <span>* Strategic tip:</span><br />
              {projectBreakdown?.hours && projectBreakdown.hours > 0 && projectBreakdown.isActive
                ? "Allocation supports active phase delivery."
                : projectBreakdown?.hours && projectBreakdown.hours === 0
                  ? "Not staffed this week."
                  : "Monitor allocations as project shifts phase."
              }
            </div>
          </div>
        </div>
      );
      break;
    default:
      content = children;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">{children}</div>
        </TooltipTrigger>
        <TooltipContent className="z-[250] max-w-xs px-3 py-2 bg-popover border border-border shadow-xl">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
