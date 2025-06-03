
import React from 'react';
import { ModernResourcesHeader } from '@/components/resources/ModernResourcesHeader';
import { EnhancedResourceGrid } from '@/components/resources/EnhancedResourceGrid';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';
import { ProjectResourcingFilterRow } from './ProjectResourcingFilterRow';

interface ProjectResourcingContentProps {
  selectedMonth: Date;
  searchTerm: string;
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
  onMonthChange: (date: Date) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
  onClearFilters: () => void;
}

export const ProjectResourcingContent: React.FC<ProjectResourcingContentProps> = ({
  selectedMonth,
  searchTerm,
  filters,
  displayOptions,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount,
  onMonthChange,
  onSearchChange,
  onFilterChange,
  onPeriodChange,
  onDisplayOptionChange,
  onClearFilters
}) => {
  const filterContent = (
    <ProjectResourcingFilters
      filters={filters}
      searchTerm={searchTerm}
      onFilterChange={onFilterChange}
      onPeriodChange={onPeriodChange}
      onSearchChange={onSearchChange}
      officeOptions={officeOptions}
      countryOptions={countryOptions}
      managers={managers}
      activeFiltersCount={activeFiltersCount}
      displayOptions={displayOptions}
      onDisplayOptionChange={onDisplayOptionChange}
    />
  );

  return (
    <div className="flex flex-col max-w-full bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <OfficeSettingsProvider>
        {/* Filter Row positioned below key metrics */}
        <ProjectResourcingFilterRow
          selectedDate={selectedMonth}
          onDateChange={onMonthChange}
          periodToShow={filters.periodToShow}
          onPeriodChange={onPeriodChange}
          filterContent={filterContent}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={onClearFilters}
        />
        
        <div className="mt-6 w-full max-w-full overflow-hidden">
          <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
            <EnhancedResourceGrid 
              startDate={selectedMonth}
              periodToShow={filters.periodToShow}
              filters={{
                ...filters,
                searchTerm
              }}
              displayOptions={displayOptions}
            />
          </div>
        </div>
      </OfficeSettingsProvider>
    </div>
  );
};
