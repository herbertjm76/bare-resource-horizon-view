
import React, { useState, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { ProjectResourcesHeader } from '@/components/resources/ProjectResourcesHeader';
import { ResourcesToolbar } from '@/components/resources/ResourcesToolbar';
import { useViewBasedDates } from '@/hooks/useViewBasedDates';
import { ViewOption } from '@/components/resources/filters/ViewSelector';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';

const ProjectResourcing = () => {
  // State management
  const [selectedView, setSelectedView] = useState<ViewOption>('3-months');
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all"
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOptions, setDisplayOptions] = useState({
    showWeekends: false,
    selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    weekStartsOnSunday: false
  });

  // Get calculated dates based on view
  const { startDate, periodToShow } = useViewBasedDates({ selectedView });

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: string) => {
    if (key === 'searchTerm') {
      setSearchTerm(value);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  }, []);

  // Handle display option changes
  const handleDisplayOptionChange = useCallback((key: string, value: any) => {
    setDisplayOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  // Calculate active filters count
  const activeFiltersCount = calculateActiveFiltersCount(filters, searchTerm, displayOptions);

  // Clear all filters function
  const clearAllFilters = createClearFiltersFunction(
    setFilters,
    setSearchTerm,
    setDisplayOptions,
    periodToShow
  );

  console.log('ProjectResourcing render:', {
    selectedView,
    startDate: startDate.toISOString(),
    periodToShow,
    activeFiltersCount
  });

  return (
    <StandardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <ProjectResourcesHeader 
          title="Project Resourcing"
          description="Manage team allocation across projects with intelligent capacity planning"
        />
        
        <ResourcesToolbar
          filters={filters}
          searchTerm={searchTerm}
          displayOptions={displayOptions}
          selectedView={selectedView}
          onFilterChange={handleFilterChange}
          onDisplayOptionChange={handleDisplayOptionChange}
          onViewChange={setSelectedView}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearAllFilters}
        />
        
        <ResourceAllocationGrid
          startDate={startDate}
          periodToShow={periodToShow}
          filters={filters}
          displayOptions={displayOptions}
        />
      </div>
    </StandardLayout>
  );
};

export default ProjectResourcing;
