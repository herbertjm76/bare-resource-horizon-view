
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface LeaveDay {
  date: string;
  hours: number;
}

interface LeaveTooltipProps {
  children: React.ReactNode;
  leaveDays: LeaveDay[];
  leaveType: string;
  capacity?: number;
}

export const LeaveTooltip: React.FC<LeaveTooltipProps> = ({
  children,
  leaveDays,
  leaveType,
  capacity = 40
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const effectiveCapacity = capacity || workWeekHours;
  
  if (!leaveDays || leaveDays.length === 0) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent className="text-xs">
          {leaveType}: {formatAllocationValue(leaveDays.reduce((sum, day) => sum + day.hours, 0), effectiveCapacity, displayPreference)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
