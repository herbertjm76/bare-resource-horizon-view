
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ProjectResourcingContent } from './components/ProjectResourcingContent';
import { useProjectResourcingState } from './hooks/useProjectResourcingState';
import { useProjectResourcingData } from './hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './utils/filterUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed on mobile
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

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
      <div className="w-full min-h-screen flex bg-gray-50">
        <DashboardSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader onMenuToggle={isMobile ? toggleSidebar : undefined} />
          <div style={{ height: HEADER_HEIGHT }} />
          <div 
            className="flex-1 p-6 bg-gray-50 flex flex-col" 
            style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}
          >
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
