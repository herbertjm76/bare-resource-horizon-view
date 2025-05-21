
import React from 'react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeaveDay {
  date: string;
  hours: number;
}

interface LeaveTooltipProps {
  leaveDays: LeaveDay[];
  children: React.ReactNode;
}

export const LeaveTooltip: React.FC<LeaveTooltipProps> = ({
  leaveDays,
  children
}) => {
  if (!leaveDays || leaveDays.length === 0) {
    return <>{children}</>;
  }

  // Sort leave days by date
  const sortedLeaveDays = [...leaveDays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="cursor-help">{children}</div>
        </TooltipTrigger>
        <TooltipContent className="p-2 max-w-xs" side="top">
          <div className="space-y-1">
            <p className="font-semibold text-sm">Leave days this week:</p>
            <ul className="space-y-1 text-xs">
              {sortedLeaveDays.map((day) => (
                <li key={day.date} className="flex justify-between gap-4">
                  <span>{format(new Date(day.date), 'EEE, MMM d')}</span>
                  <span className="font-medium">{day.hours} hrs</span>
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
