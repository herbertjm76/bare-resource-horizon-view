
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeRange = 'week' | 'month' | '3months' | '4months' | '6months' | 'year';

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
    { value: '3months' as TimeRange, label: '3 Months' },
    { value: '4months' as TimeRange, label: '4 Months' },
    { value: '6months' as TimeRange, label: '6 Months' },
    { value: 'year' as TimeRange, label: '1 Year' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Time Range</label>
      <Select
        value={selectedRange}
        onValueChange={onRangeChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {timeRangeOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
