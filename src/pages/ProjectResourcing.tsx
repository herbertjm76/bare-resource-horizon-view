
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { CalendarDays } from 'lucide-react';

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
    <StandardLayout 
      contentClassName="p-6 bg-gray-50 flex flex-col"
    >
      <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {/* Standardized Header with icon and title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <CalendarDays className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Project Resourcing
          </h1>
        </div>

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
      </div>
    </StandardLayout>
  );
};

export default ProjectResourcing;
