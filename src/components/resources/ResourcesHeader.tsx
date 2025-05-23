
import React from 'react';
import { SearchInput } from './filters/SearchInput';
import { FilterButton } from './filters/FilterButton';
import { MonthYearSelector } from './filters/MonthYearSelector';

interface ResourcesHeaderProps {
  title: string;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterContent: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export const ResourcesHeader: React.FC<ResourcesHeaderProps> = ({
  title,
  selectedMonth,
  onMonthChange,
  searchTerm,
  onSearchChange,
  filterContent,
  activeFiltersCount,
  onClearFilters
}) => {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-primary">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-2 rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          <MonthYearSelector 
            selectedDate={selectedMonth} 
            onDateChange={onMonthChange}
          />
        </div>
        
        <FilterButton
          activeFiltersCount={activeFiltersCount}
          filterContent={filterContent}
          onClearFilters={onClearFilters}
          className="ml-auto"
        />
      </div>
    </div>
  );
};
