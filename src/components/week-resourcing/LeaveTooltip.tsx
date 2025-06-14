
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface LeaveDay {
  date: string;
  hours: number;
}

interface LeaveTooltipProps {
  children: React.ReactNode;
  leaveDays: LeaveDay[];
  leaveType: string;
}

export const LeaveTooltip: React.FC<LeaveTooltipProps> = ({
  children,
  leaveDays,
  leaveType
}) => {
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
        <TooltipContent>
          <div className="text-sm max-w-xs">
            <p className="font-semibold mb-2">{leaveType} Details</p>
            {leaveDays.map((day, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{format(new Date(day.date), 'MMM dd')}</span>
                <span className="ml-2 font-medium">{day.hours}h</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
