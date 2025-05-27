
import React, { useMemo } from 'react';
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
          <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-white/30">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-md border-white/30">
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
    <div className="sticky top-0 z-20 bg-white/20 backdrop-blur-md border-b border-white/20 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <h2 className="text-xs sm:text-sm text-gray-700 mb-0.5 font-medium">TODAY IS</h2>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{today}</p>
          </div>
          
          {/* Time period quick selection buttons */}
          <div className="flex gap-2">
            <Button
              variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('week')}
              className="text-xs bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40"
            >
              This Week
            </Button>
            <Button
              variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('month')}
              className="text-xs bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40"
            >
              This Month
            </Button>
            <Button
              variant={selectedTimeRange === '3months' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange('3months')}
              className="text-xs bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40"
            >
              This Quarter
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
            <FilterButton
              activeFiltersCount={activeFiltersCount}
              filterContent={filterContent}
              onClearFilters={clearAllFilters}
              buttonText="Filters"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
