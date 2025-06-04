
import React from 'react';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';
import { Button } from "@/components/ui/button";
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
  officeOptions: string[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedOffice,
  setSelectedOffice,
  selectedTimeRange,
  setSelectedTimeRange,
  officeOptions
}) => {
  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedOffice('All Offices');
    setSelectedTimeRange('month');
  };

  // Count active filters
  const activeFiltersCount = (selectedOffice !== 'All Offices' ? 1 : 0) + (selectedTimeRange !== 'month' ? 1 : 0);

  // Filter content for the FilterButton
  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Office</label>
        <Select
          value={selectedOffice}
          onValueChange={setSelectedOffice}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            {officeOptions.map((office) => (
              <SelectItem key={office} value={office}>
                {office}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TimeRangeSelector
        selectedRange={selectedTimeRange}
        onRangeChange={setSelectedTimeRange}
      />
    </div>
  );

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-gray-200 p-4">
      <div className="flex flex-row justify-between items-center gap-2">
        {/* Time period quick selection buttons - horizontal on mobile */}
        <div className="flex gap-1 flex-wrap">
          <Button
            variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('week')}
            className="text-xs px-2 py-1 h-7"
          >
            Week
          </Button>
          <Button
            variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('month')}
            className="text-xs px-2 py-1 h-7"
          >
            Month
          </Button>
          <Button
            variant={selectedTimeRange === '3months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('3months')}
            className="text-xs px-2 py-1 h-7"
          >
            Quarter
          </Button>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <FilterButton
            activeFiltersCount={activeFiltersCount}
            filterContent={filterContent}
            onClearFilters={clearAllFilters}
            buttonText="Filters"
          />
        </div>
      </div>
    </div>
  );
};
