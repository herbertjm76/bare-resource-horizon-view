
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectResourcingContent } from './components/ProjectResourcingContent';
import { useProjectResourcingState } from './hooks/useProjectResourcingState';
import { useProjectResourcingData } from './hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './utils/filterUtils';
import { List, Sparkles } from 'lucide-react';

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
      <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-indigo-50 via-white to-purple-50/60">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div 
            className="flex-1 p-8 sm:p-10 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 flex flex-col" 
            style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}
          >
            {/* Enhanced Modern Header Section */}
            <div className="space-y-8 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                      <List className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Project Resourcing
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        <p className="text-lg text-gray-600 font-medium">
                          Intelligent resource allocation and project planning
                        </p>
                      </div>
                    </div>
                  </div>
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
