
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
  let content = null;

  switch (type) {
    case 'utilization':
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-[#6465F0]">
            {member?.first_name} — Utilization
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div>
              <span className="font-semibold">Utilization:</span> {utilizationPercentage ?? '-'}%
            </div>
            <div>
              <span className="font-semibold">Total Used:</span> {totalUsedHours ?? '-'}h / {weeklyCapacity ?? '-'}h
            </div>
            <div>
              <span className="font-semibold">Annual Leave:</span> {annualLeave}h, <span className="font-semibold">Holiday:</span> {holidayHours}h
            </div>
            <div className="text-gray-500 mt-1">
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
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-[#6465F0]">
            Leave Summary
          </div>
          <div className="text-xs space-y-1">
            {annualLeave > 0 && (
              <div>
                <span className="font-semibold">Annual Leave:</span> {annualLeave}h
              </div>
            )}
            {holidayHours > 0 && (
              <div>
                <span className="font-semibold">Holiday:</span> {holidayHours}h
              </div>
            )}
            {(totalUsedHours ?? 0) - annualLeave - holidayHours > 0 && (
              <div>
                <span className="font-semibold">Other Leave:</span> {(totalUsedHours ?? 0) - annualLeave - holidayHours}h
              </div>
            )}
            <div className="border-t border-gray-200 pt-1 mt-1">
              <span className="font-semibold">Total:</span> {totalUsedHours ?? 0}h
            </div>
            {!!leaveDays.length && (
              <div className="mt-2 border-t border-gray-200 pt-2">
                <div className="font-semibold mb-1">Dates Out:</div>
                {leaveDays.map((day, i) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <div key={i} className="flex justify-between gap-3">
                      <span>{dayName}, {dateStr}</span>
                      <span className="font-medium">{day.hours}h</span>
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
      content = (
        <div className="space-y-2">
          <div className="font-bold mb-2 text-[#6465F0]">
            Project: {projectBreakdown?.projectName ?? '-'}
          </div>
          <div className="text-xs space-y-1">
            <div>
              <span className="font-semibold">Code:</span> {projectBreakdown?.projectCode || '—'}
            </div>
            <div>
              <span className="font-semibold">Stage:</span> {projectBreakdown?.projectStage || '—'}
            </div>
            <div>
              <span className="font-semibold">Fee:</span> {projectBreakdown?.projectFee ? `$${projectBreakdown.projectFee}` : '—'}
            </div>
            <div>
              <span className="font-semibold">Weekly Allocation:</span> {projectBreakdown?.hours ?? 0}h
            </div>
            <div>
              <span className="font-semibold">Status:</span> {projectBreakdown?.isActive ? "Active" : "Inactive"}
            </div>
            <div className="text-gray-500 mt-1">
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
        <TooltipContent className="z-[250] max-w-xs px-3 py-2 bg-white border border-gray-200 shadow-xl">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
