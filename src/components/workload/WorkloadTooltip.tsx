
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WorkloadBreakdown } from './hooks/types';

interface WorkloadTooltipProps {
  children: React.ReactNode;
  breakdown: WorkloadBreakdown;
  memberName: string;
  date: string;
}

export const WorkloadTooltip: React.FC<WorkloadTooltipProps> = ({
  children,
  breakdown,
  memberName,
  date
}) => {
  if (breakdown.total === 0) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-white border shadow-lg p-3 max-w-xs z-[100]">
        <div className="space-y-2">
          <div className="font-medium text-sm text-gray-900">
            {memberName} - {date}
          </div>
          <div className="space-y-1 text-xs">
            {breakdown.projectHours > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-600">Project Hours:</span>
                <span className="font-medium">{breakdown.projectHours}h</span>
              </div>
            )}
            {breakdown.annualLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Annual Leave:</span>
                <span className="font-medium">{breakdown.annualLeave}h</span>
              </div>
            )}
            {breakdown.officeHolidays > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600">Holiday Hours:</span>
                <span className="font-medium">{breakdown.officeHolidays}h</span>
              </div>
            )}
            {breakdown.otherLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Other Leave:</span>
                <span className="font-medium">{breakdown.otherLeave}h</span>
              </div>
            )}
            <div className="border-t pt-1 flex justify-between font-medium">
              <span>Total:</span>
              <span>{breakdown.total}h</span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
