
import React, { useMemo } from 'react';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { TimeRangeSelector, TimeRange } from './TimeRangeSelector';
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
  // Memoize today's date to prevent re-renders
  const today = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  }, []);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xs sm:text-sm text-gray-600 mb-0.5">TODAY IS</h2>
          <p className="text-lg sm:text-2xl font-bold">{today}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
