
import React, { useState, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { ProjectResourcingHeader } from './ProjectResourcing/components/ProjectResourcingHeader';
import { ProjectResourcingFilterRow } from './ProjectResourcing/components/ProjectResourcingFilterRow';
import { useViewBasedDates } from '@/hooks/useViewBasedDates';
import { ViewOption } from '@/components/resources/filters/ViewSelector';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { format, startOfMonth } from 'date-fns';

const ProjectResourcing = () => {
  // State management
  const [selectedView, setSelectedView] = useState<ViewOption>('3-months');
  const [selectedDate, setSelectedDate] = useState(startOfMonth(new Date()));
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    periodToShow: 12
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [displayOptions, setDisplayOptions] = useState({
    showWeekends: false,
    selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    weekStartsOnSunday: false
  });
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

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
  const handleDisplayOptionChange = useCallback((option: string, value: boolean | string[]) => {
    setDisplayOptions(prev => ({ ...prev, [option]: value }));
  }, []);

  // Handle period changes
  const handlePeriodChange = useCallback((period: number) => {
    setFilters(prev => ({ ...prev, periodToShow: period }));
  }, []);

  // Calculate active filters count
  const activeFiltersCount = calculateActiveFiltersCount(filters, searchTerm, displayOptions);

  // Clear all filters function
  const clearAllFilters = createClearFiltersFunction(
    setFilters,
    setSearchTerm,
    setDisplayOptions
  );

  // Expand/collapse handlers
  const handleExpandAll = () => {
    // This would expand all projects - implement with actual project IDs
    setExpandedProjects(['all']);
  };

  const handleCollapseAll = () => {
    setExpandedProjects([]);
  };

  // Mock data for filters
  const officeOptions = ['London', 'New York', 'Singapore', 'Tokyo', 'Paris'];
  const countryOptions = ['UK', 'USA', 'Singapore', 'Japan', 'France'];
  const managerOptions = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' },
    { id: '3', name: 'Alex Johnson' }
  ];

  // Calculate project count (mock for now)
  const projectCount = 4;

  console.log('ProjectResourcing render:', {
    selectedView,
    startDate: startDate.toISOString(),
    periodToShow,
    activeFiltersCount
  });

  return (
    <StandardLayout>
      <OfficeSettingsProvider>
        <div className="flex-1 space-y-6 p-4 md:p-8">
          <ProjectResourcingHeader 
            projectCount={projectCount}
            periodToShow={periodToShow}
          />
          
          <ProjectResourcingFilterRow
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            periodToShow={filters.periodToShow}
            onPeriodChange={handlePeriodChange}
            filters={filters}
            searchTerm={searchTerm}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchTerm}
            officeOptions={officeOptions}
            countryOptions={countryOptions}
            managers={managerOptions}
            activeFiltersCount={activeFiltersCount}
            displayOptions={displayOptions}
            onDisplayOptionChange={handleDisplayOptionChange}
            onClearFilters={clearAllFilters}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            expandedProjects={expandedProjects}
            totalProjects={projectCount}
          />
          
          <ResourceAllocationGrid
            startDate={startDate}
            periodToShow={periodToShow}
            filters={filters}
            displayOptions={displayOptions}
          />
        </div>
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default ProjectResourcing;
