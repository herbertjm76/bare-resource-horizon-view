
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
      <div className="flex flex-col gap-3">
        {/* Time period quick selection buttons - Force single line with scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 min-w-0">
          <Button
            variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('week')}
            className="text-xs whitespace-nowrap flex-shrink-0"
          >
            This Week
          </Button>
          <Button
            variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('month')}
            className="text-xs whitespace-nowrap flex-shrink-0"
          >
            This Month
          </Button>
          <Button
            variant={selectedTimeRange === '3months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('3months')}
            className="text-xs whitespace-nowrap flex-shrink-0"
          >
            This Quarter
          </Button>
        </div>
        
        {/* Filter button - stays in single line */}
        <div className="flex items-center justify-end">
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
