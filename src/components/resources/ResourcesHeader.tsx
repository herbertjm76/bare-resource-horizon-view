
import React from 'react';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { FilterPopover } from '@/components/filters/FilterPopover';

interface ResourcesHeaderProps {
  title: string;
  selectedWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  weekLabel: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterContent: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export const ResourcesHeader: React.FC<ResourcesHeaderProps> = ({
  title,
  selectedWeek,
  onPreviousWeek,
  onNextWeek,
  weekLabel,
  searchTerm,
  onSearchChange,
  filterContent,
  activeFiltersCount,
  onClearFilters
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary">{title}</h1>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Week selector in a bordered box */}
        <div className="flex border rounded-md p-2 items-center">
          <WeekSelector
            selectedWeek={selectedWeek}
            onPreviousWeek={onPreviousWeek}
            onNextWeek={onNextWeek}
            weekLabel={weekLabel}
          />
        </div>
        
        {/* Search and filter in a bordered box */}
        <div className="flex items-center border rounded-md p-2 gap-2 flex-1 max-w-md">
          <div className="flex-1">
            <SearchInput 
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search projects..."
            />
          </div>
          
          <FilterPopover
            activeFiltersCount={activeFiltersCount}
            onClearFilters={onClearFilters}
          >
            {filterContent}
          </FilterPopover>
        </div>
      </div>
    </>
  );
};
