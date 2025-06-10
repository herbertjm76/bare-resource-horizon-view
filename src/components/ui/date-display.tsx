
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DateFormat = 'short' | 'long' | 'numeric' | 'time';

interface DateFormatOption {
  key: DateFormat;
  label: string;
  example: string;
}

interface DateDisplayProps {
  className?: string;
  showIcon?: boolean;
  showTimezone?: boolean;
  allowFormatSelection?: boolean;
  defaultFormat?: DateFormat;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  className,
  showIcon = true,
  showTimezone = false,
  allowFormatSelection = true,
  defaultFormat = 'long'
}) => {
  const [selectedFormat, setSelectedFormat] = useState<DateFormat>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('date-display-format');
      return (saved as DateFormat) || defaultFormat;
    }
    return defaultFormat;
  });

  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save format preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('date-display-format', selectedFormat);
    }
  }, [selectedFormat]);

  // Get current date and timezone
  const currentDate = useMemo(() => new Date(), []);
  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  // Format options with examples
  const formatOptions: DateFormatOption[] = useMemo(() => {
    const now = new Date();
    return [
      {
        key: 'short',
        label: 'Short Date',
        example: now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      },
      {
        key: 'long',
        label: 'Long Date',
        example: now.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      },
      {
        key: 'numeric',
        label: 'Numeric',
        example: now.toLocaleDateString('en-US')
      },
      {
        key: 'time',
        label: 'Date & Time',
        example: now.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        })
      }
    ];
  }, []);

  // Get the effective format (mobile override)
  const effectiveFormat = useMemo(() => {
    if (isMobile) {
      return 'numeric'; // Shortest format for mobile
    }
    return selectedFormat;
  }, [isMobile, selectedFormat]);

  // Format the current date based on effective format
  const formattedDate = useMemo(() => {
    switch (effectiveFormat) {
      case 'short':
        return currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'long':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'numeric':
        return currentDate.toLocaleDateString('en-US');
      case 'time':
        return currentDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      default:
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
    }
  }, [currentDate, effectiveFormat]);

  // Get appropriate icon based on format
  const getIcon = () => {
    if (effectiveFormat === 'time') return Clock;
    if (showTimezone) return Globe;
    return Calendar;
  };

  const IconComponent = getIcon();

  const dateContent = (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {showIcon && (
        <IconComponent className="h-4 w-4 text-gray-500 flex-shrink-0" />
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-gray-700 truncate">
          {formattedDate}
        </span>
        {showTimezone && (
          <span className="text-xs text-gray-500 truncate">
            {timezone}
          </span>
        )}
      </div>
    </div>
  );

  if (!allowFormatSelection || isMobile) {
    return dateContent;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-2 hover:bg-gray-50 min-w-0">
          {dateContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Date Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formatOptions.map((option) => (
          <DropdownMenuItem
            key={option.key}
            onClick={() => setSelectedFormat(option.key)}
            className={cn(
              "flex flex-col items-start gap-1 cursor-pointer",
              selectedFormat === option.key && "bg-gray-100"
            )}
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-gray-500">{option.example}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setSelectedFormat(selectedFormat)}
          className="text-xs text-gray-500 cursor-default"
        >
          Timezone: {timezone}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
