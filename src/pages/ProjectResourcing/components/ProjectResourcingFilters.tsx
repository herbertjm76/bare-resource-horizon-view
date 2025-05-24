
import React from 'react';
import { ProjectResourceFilters } from '@/components/resources/filters/ProjectResourceFilters';

interface ProjectResourcingFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  searchTerm: string;
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
  onSearchChange: (value: string) => void;
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
}

export const ProjectResourcingFilters: React.FC<ProjectResourcingFiltersProps> = ({
  filters,
  searchTerm,
  displayOptions,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount,
  onFilterChange,
  onPeriodChange,
  onSearchChange,
  onDisplayOptionChange
}) => {
  return (
    <ProjectResourceFilters
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
};
