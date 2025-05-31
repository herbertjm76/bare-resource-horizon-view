
import React from 'react';
import { ModernResourcesHeader } from '@/components/resources/ModernResourcesHeader';
import { ModernResourceGridContainer } from '@/components/resources/ModernResourceGridContainer';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';

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
        <ModernResourceGridContainer
          startDate={selectedMonth}
          periodToShow={filters.periodToShow}
          filters={{
            ...filters,
            searchTerm
          }}
          displayOptions={displayOptions}
        />
      </OfficeSettingsProvider>
    </div>
  );
};
