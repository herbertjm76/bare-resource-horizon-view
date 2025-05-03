
import React, { useState } from 'react';
import { FilterButton } from './filters/FilterButton';
import { AdvancedFilters } from './filters/AdvancedFilters';
import { FilterBadges } from './filters/FilterBadges';
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
  managerOptions: Array<{ id: string; name: string }>;
  weekOptions: Array<{ value: string; label: string }>;
  hideSearchAndWeeksSelector?: boolean;
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
  weekOptions,
  hideSearchAndWeeksSelector = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Calculate active filters count
  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (value !== 'all') count++;
    return count;
  }, 0);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex flex-col w-auto">
      <div className="flex items-center gap-2">
        {!hideSearchAndWeeksSelector && (
          <div className="flex-1">
            <SearchInput 
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search projects..."
            />
          </div>
        )}
        
        <div>
          <FilterButton 
            activeFiltersCount={activeFiltersCount} 
          />
        </div>
        
        {!hideSearchAndWeeksSelector && (
          <div className="ml-auto">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={weeksToShow.toString()}
              onChange={(e) => onWeeksChange(Number(e.target.value))}
            >
              {weekOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Filter badges */}
      <FilterBadges 
        filters={filters}
        onFilterChange={onFilterChange}
        officeOptions={officeOptions}
        countryOptions={countryOptions}
        managerOptions={managerOptions}
      />
      
      {/* Advanced Filters */}
      <AdvancedFilters
        show={showFilters}
        filters={filters}
        onFilterChange={onFilterChange}
        officeOptions={officeOptions}
        countryOptions={countryOptions}
        managerOptions={managerOptions}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
