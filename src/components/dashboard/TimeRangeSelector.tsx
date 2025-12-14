
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeRange = 'week' | 'month' | '3months';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange
}) => {
  const timeRangeOptions = [
    { value: 'week' as TimeRange, label: 'This Week' },
    { value: 'month' as TimeRange, label: 'This Month' },
    { value: '3months' as TimeRange, label: 'This Quarter' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Time Range</label>
      <Select
        value={selectedRange}
        onValueChange={onRangeChange}
      >
        <SelectTrigger className="w-full bg-background border-border">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {timeRangeOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="data-[state=checked]:bg-gradient-modern data-[state=checked]:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
