import React, { useState, useCallback, useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { ProjectResourceFilters } from '@/components/resources/filters/ProjectResourceFilters';
import { ResourcesHeader } from '@/components/resources/ResourcesHeader';
import { ResourceGridContainer } from '@/components/resources/ResourceGridContainer';
import { format } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  // Use the current month as the default view
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    periodToShow: 12, // Default is 12 weeks
  });
  
  const [displayOptions, setDisplayOptions] = useState({
    showWeekends: true,
    selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'], // Default to weekdays only
    weekStartsOnSunday: false // Default: week starts on Monday
  });
  
  // Get project data
  const { projects, isLoading: isLoadingProjects } = useProjects();
  
  // Get team members data - passing true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handlePeriodChange = (period: number) => {
    setFilters(prev => ({
      ...prev,
      periodToShow: period
    }));
  };
  
  const handleDisplayOptionChange = (option: string, value: boolean | string[]) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: value
    }));
    
    // If we're hiding weekends, remove weekend days from selectedDays
    if (option === 'showWeekends' && value === false) {
      setDisplayOptions(prev => ({
        ...prev,
        selectedDays: prev.selectedDays.filter(day => day !== 'sat' && day !== 'sun')
      }));
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleMonthChange = useCallback((date: Date) => {
    setSelectedMonth(date);
  }, []);

  // Format the month label
  const monthLabel = useMemo(() => {
    return format(selectedMonth, 'MMMM yyyy');
  }, [selectedMonth]);
  
  // Extract unique offices, countries, and managers for filters
  const officeOptions = useMemo(() => {
    return [...new Set(projects.map(p => p.office?.name).filter(Boolean))];
  }, [projects]);
  
  const countryOptions = useMemo(() => {
    return [...new Set(projects.map(p => p.country).filter(Boolean))];
  }, [projects]);
  
  const managers = useMemo(() => {
    return projects.reduce((acc, project) => {
      if (project.project_manager && !acc.some(m => m.id === project.project_manager.id)) {
        acc.push({
          id: project.project_manager.id,
          name: `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim()
        });
      }
      return acc;
    }, [] as Array<{id: string, name: string}>);
  }, [projects]);

  // Calculate active filters count (include display options)
  const activeFiltersCount = 
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (!displayOptions.showWeekends ? 1 : 0) +
    (displayOptions.selectedDays.length < 7 ? 1 : 0) +
    (displayOptions.weekStartsOnSunday ? 1 : 0);
  
  // Clear all filters and reset display options
  const clearFilters = () => {
    setFilters({
      office: "all",
      country: "all",
      manager: "all",
      periodToShow: filters.periodToShow // Keep the period setting
    });
    setSearchTerm('');
    setDisplayOptions({
      showWeekends: true,
      selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      weekStartsOnSunday: false
    });
  };

  // Prepare filter props for the ProjectResourceFilters component
  const filterContent = (
    <ProjectResourceFilters
      filters={filters}
      searchTerm={searchTerm}
      onFilterChange={handleFilterChange}
      onPeriodChange={handlePeriodChange}
      onSearchChange={handleSearchChange}
      officeOptions={officeOptions}
      countryOptions={countryOptions}
      managers={managers}
      activeFiltersCount={activeFiltersCount}
      displayOptions={displayOptions}
      onDisplayOptionChange={handleDisplayOptionChange}
    />
  );

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div 
            className="flex-1 p-4 sm:p-8 bg-background flex flex-col" 
            style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}
          >
            <div className="flex flex-col max-w-full">
              <ResourcesHeader
                title="Project Resourcing"
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterContent={filterContent}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
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
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectResourcing;
