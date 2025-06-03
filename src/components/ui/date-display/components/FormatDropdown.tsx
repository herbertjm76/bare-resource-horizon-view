
import React from 'react';
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
import { DateFormat, DateFormatOption } from '../types';

interface FormatDropdownProps {
  children: React.ReactNode;
  selectedFormat: DateFormat;
  setSelectedFormat: (format: DateFormat) => void;
  formatOptions: DateFormatOption[];
  timezone: string;
}

export const FormatDropdown: React.FC<FormatDropdownProps> = ({
  children,
  selectedFormat,
  setSelectedFormat,
  formatOptions,
  timezone
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-2 hover:bg-gray-50">
          {children}
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
