
import React from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateFormat } from '../types';

interface DateContentProps {
  formattedDate: string;
  timezone: string;
  selectedFormat: DateFormat;
  showIcon: boolean;
  showTimezone: boolean;
  className?: string;
}

export const DateContent: React.FC<DateContentProps> = ({
  formattedDate,
  timezone,
  selectedFormat,
  showIcon,
  showTimezone,
  className
}) => {
  // Get appropriate icon based on format
  const getIcon = () => {
    if (selectedFormat === 'time') return Clock;
    if (showTimezone) return Globe;
    return Calendar;
  };

  const IconComponent = getIcon();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <IconComponent className="h-4 w-4 text-gray-500" />
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">
          {formattedDate}
        </span>
        {showTimezone && (
          <span className="text-xs text-gray-500">
            {timezone}
          </span>
        )}
      </div>
    </div>
  );
};
