
import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { WeekSelector } from './filters/WeekSelector';
import { FilterButton } from './filters/FilterButton';
import { FilterBadges } from './filters/FilterBadges';
import { AdvancedFilters } from './filters/AdvancedFilters';

interface FilterBarProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  onFilterChange: (key: string, value: string) => void;
  weeksToShow: number;
  onWeeksChange: (weeks: number) => void;
  officeOptions: string[];
  countryOptions: string[];
  managerOptions: {id: string, name: string}[];
  weekOptions: {value: string, label: string}[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  weeksToShow,
  onWeeksChange,
  officeOptions,
  countryOptions,
  managerOptions,
  weekOptions
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFiltersCount = 
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0);

  const clearFilters = () => {
    onFilterChange('office', 'all');
    onFilterChange('country', 'all');
    onFilterChange('manager', 'all');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Weeks to Show */}
          <WeekSelector 
            weeksToShow={weeksToShow}
            onWeeksChange={onWeeksChange}
            weekOptions={weekOptions}
          />

          {/* Advanced Filters Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <FilterButton activeFiltersCount={activeFiltersCount} />
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
              <AdvancedFilters 
                filters={filters}
                onFilterChange={onFilterChange}
                officeOptions={officeOptions}
                countryOptions={countryOptions}
                managerOptions={managerOptions}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filters display */}
        <FilterBadges 
          filters={filters} 
          onFilterChange={onFilterChange} 
          managerOptions={managerOptions} 
        />
      </div>
    </div>
  );
};
