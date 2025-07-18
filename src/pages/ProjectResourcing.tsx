
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';

const ProjectResourcing = () => {
  const {
    selectedMonth,
    searchTerm,
    filters,
    displayOptions,
    handleFilterChange,
    handlePeriodChange,
    handleDisplayOptionChange,
    handleSearchChange,
    handleMonthChange,
    setFilters,
    setSearchTerm,
    setDisplayOptions
  } = useProjectResourcingState();

  const {
    officeOptions,
    countryOptions,
    managers
  } = useProjectResourcingData();

  // Calculate active filters count (include display options)
  const activeFiltersCount = calculateActiveFiltersCount(filters, searchTerm, displayOptions);
  
  // Clear all filters and reset display options
  const clearFilters = createClearFiltersFunction(
    setFilters,
    setSearchTerm,
    setDisplayOptions,
    filters.periodToShow
  );

  return (
    <StandardLayout>
      <ProjectResourcingContent
          selectedMonth={selectedMonth}
          searchTerm={searchTerm}
          filters={filters}
          displayOptions={displayOptions}
          officeOptions={officeOptions}
          countryOptions={countryOptions}
          managers={managers}
          activeFiltersCount={activeFiltersCount}
          onMonthChange={handleMonthChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onPeriodChange={handlePeriodChange}
          onDisplayOptionChange={handleDisplayOptionChange}
          onClearFilters={clearFilters}
        />
    </StandardLayout>
  );
};

export default ProjectResourcing;
