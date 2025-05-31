
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectResourcingContent } from './components/ProjectResourcingContent';
import { useProjectResourcingState } from './hooks/useProjectResourcingState';
import { useProjectResourcingData } from './hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './utils/filterUtils';
import { CalendarDays } from 'lucide-react';

const HEADER_HEIGHT = 56;

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
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div 
            className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20 flex flex-col" 
            style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}
          >
            {/* Modern Header Section */}
            <div className="space-y-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                    <CalendarDays className="h-8 w-8 text-brand-violet" />
                    Project Resourcing
                  </h1>
                </div>
              </div>
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
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectResourcing;
