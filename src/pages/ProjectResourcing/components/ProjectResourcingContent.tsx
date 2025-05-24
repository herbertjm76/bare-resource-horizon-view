
import React from 'react';
import { ResourcesHeader } from '@/components/resources/ResourcesHeader';
import { ResourceGridContainer } from '@/components/resources/ResourceGridContainer';
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
    <div className="flex flex-col max-w-full">
      <ResourcesHeader
        title="Project Resourcing"
        selectedMonth={selectedMonth}
        onMonthChange={onMonthChange}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filterContent={filterContent}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={onClearFilters}
      />
      
      <OfficeSettingsProvider>
        <ResourceGridContainer
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
