
import React from 'react';
import { TimeRange } from './TimeRangeSelector';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardHeaderProps {
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (range: TimeRange) => void;
  officeOptions: Array<{ value: string; label: string }>;
}

const timeRangeOptions = [
  { value: 'week' as TimeRange, label: 'This Week' },
  { value: 'month' as TimeRange, label: 'This Month' },
  { value: '3months' as TimeRange, label: 'This Quarter' }
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedOffice,
  setSelectedOffice,
  selectedTimeRange,
  setSelectedTimeRange,
  officeOptions
}) => {
  const selectedLabel = timeRangeOptions.find(o => o.value === selectedTimeRange)?.label || 'This Month';

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Centered Time Range Selector - Prominent */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Calendar className="h-4 w-4" />
            <span>Viewing data for</span>
          </div>
          
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger 
              className="w-auto min-w-[200px] h-12 text-lg font-semibold bg-card border-2 border-border/50 hover:border-primary/50 transition-colors shadow-sm"
            >
              <SelectValue placeholder="Select time range">
                {selectedLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="center">
              {timeRangeOptions.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-base py-2.5 data-[state=checked]:bg-gradient-modern data-[state=checked]:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground mt-2">
            All metrics and charts below reflect this time period
          </p>
        </div>
      </div>
    </div>
  );
};
