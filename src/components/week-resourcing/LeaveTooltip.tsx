
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
  leaveType?: string;
}

export const LeaveTooltip: React.FC<LeaveTooltipProps> = ({
  leaveDays,
  children,
  leaveType = 'Leave'
}) => {
  if (!leaveDays || leaveDays.length === 0) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="cursor-help">{children}</div>
          </TooltipTrigger>
          <TooltipContent className="p-2 max-w-xs bg-white border shadow-lg" side="top">
            <div className="space-y-1">
              <p className="font-semibold text-sm text-gray-900">No {leaveType.toLowerCase()} scheduled</p>
              <p className="text-xs text-gray-600">This week is clear of any {leaveType.toLowerCase()}.</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Sort leave days by date
  const sortedLeaveDays = [...leaveDays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate total hours
  const totalHours = sortedLeaveDays.reduce((sum, day) => sum + day.hours, 0);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="cursor-help">{children}</div>
        </TooltipTrigger>
        <TooltipContent className="p-3 max-w-xs bg-white border shadow-lg" side="top">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm text-gray-900">{leaveType}</p>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {totalHours}h total
              </span>
            </div>
            <div className="border-t pt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">This week's schedule:</p>
              <ul className="space-y-1 text-xs">
                {sortedLeaveDays.map((day) => (
                  <li key={day.date} className="flex justify-between gap-4">
                    <span className="text-gray-700">{format(new Date(day.date), 'EEE, MMM d')}</span>
                    <span className="font-medium text-gray-900">{day.hours}h</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
