import React from 'react';
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = 'week' | 'month' | 'next-month';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthChange,
  timeRange,
  onTimeRangeChange
}) => {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };
  
  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const getDisplayLabel = () => {
    switch (timeRange) {
      case 'week':
        return 'This Week';
      case 'month':
        return format(selectedMonth, 'MMMM yyyy');
      case 'next-month':
        return format(addMonths(new Date(), 1), 'MMMM yyyy');
      default:
        return format(selectedMonth, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ToggleGroup 
        type="single" 
        value={timeRange} 
        onValueChange={(value) => value && onTimeRangeChange(value as TimeRange)}
        className="bg-muted/50 p-1 rounded-lg"
      >
        <ToggleGroupItem 
          value="week" 
          className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          This Week
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="month" 
          className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          This Month
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="next-month" 
          className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          Next Month
        </ToggleGroupItem>
      </ToggleGroup>

      {timeRange === 'month' && (
        <div className="flex items-center gap-1 bg-card rounded-md shadow-sm px-2 py-1">
          <Button variant="ghost" size="icon" onClick={handlePreviousMonth} className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-24 text-center">
            {format(selectedMonth, 'MMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
