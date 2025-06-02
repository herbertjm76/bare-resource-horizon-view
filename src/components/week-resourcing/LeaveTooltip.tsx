
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LeaveDayInfo {
  date: string;
  hours: number;
}

interface LeaveTooltipProps {
  leaveDays: LeaveDayInfo[];
  leaveType: string;
  children: React.ReactNode;
}

export const LeaveTooltip: React.FC<LeaveTooltipProps> = ({ 
  leaveDays, 
  leaveType, 
  children 
}) => {
  if (!leaveDays || leaveDays.length === 0) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">{leaveType}</p>
          {leaveDays.map((day, index) => (
            <p key={index} className="text-xs">
              {day.date}: {day.hours}h
            </p>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
