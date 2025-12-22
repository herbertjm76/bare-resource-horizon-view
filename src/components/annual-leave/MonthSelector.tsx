import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = 'week' | 'month' | 'next-month';

interface MonthSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="flex items-center justify-center">
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
    </div>
  );
};
