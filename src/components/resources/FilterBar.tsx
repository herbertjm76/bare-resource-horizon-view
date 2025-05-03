
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
import { SearchInput } from './filters/SearchInput';

interface FilterBarProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  onFilterChange: (key: string, value: string) => void;
  weeksToShow: number;
  onWeeksChange: (weeks: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
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
  searchTerm,
  onSearchChange,
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-stretch gap-4">
        {/* Week selector group */}
        <div className="flex-1 md:flex-none p-4 bg-white border rounded-lg shadow-sm min-w-[220px]">
          <div className="font-medium text-sm text-muted-foreground mb-2">Time Period</div>
          <WeekSelector 
            weeksToShow={weeksToShow}
            onWeeksChange={onWeeksChange}
            weekOptions={weekOptions}
          />
        </div>
        
        {/* Search and filter group */}
        <div className="flex-1 p-4 bg-white border rounded-lg shadow-sm">
          <div className="font-medium text-sm text-muted-foreground mb-2">Find Projects</div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <SearchInput 
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Search project name..."
              />
            </div>
            
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <div>
                  <FilterButton activeFiltersCount={activeFiltersCount} />
                </div>
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
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <FilterBadges 
          filters={filters} 
          onFilterChange={onFilterChange} 
          managerOptions={managerOptions} 
        />
      )}
    </div>
  );
};
