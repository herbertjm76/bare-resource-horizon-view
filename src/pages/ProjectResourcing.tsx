
import React, { useState, useCallback } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { FilterBar } from '@/components/resources/FilterBar';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { SearchInput } from '@/components/resources/filters/SearchInput';

const HEADER_HEIGHT = 56;
const FILTERS_HEIGHT = 126; // Height of filters section including margins

const ProjectResourcing = () => {
  // Get the start of the current week (Monday)
  const today = new Date();
  const mondayOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(mondayOfCurrentWeek);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    weeksToShow: 12, // Default is 12 weeks
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
  
  const handleWeeksChange = (weeks: number) => {
    setFilters(prev => ({
      ...prev,
      weeksToShow: weeks
    }));
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  // Week navigation functions
  const goToPreviousWeek = useCallback(() => {
    setSelectedWeek(prevWeek => subWeeks(prevWeek, 1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setSelectedWeek(prevWeek => addWeeks(prevWeek, 1));
  }, []);

  // Format the week label
  const weekLabel = useCallback((date: Date) => {
    const endOfWeek = addWeeks(date, 0);
    return `Week of ${format(date, 'MMM d, yyyy')}`;
  }, []);
  
  // Extract unique offices, countries, and managers for filters
  const officeOptions = [...new Set(projects.map(p => p.office?.name).filter(Boolean))];
  const countryOptions = [...new Set(projects.map(p => p.country).filter(Boolean))];
  const managers = projects.reduce((acc, project) => {
    if (project.project_manager && !acc.some(m => m.id === project.project_manager.id)) {
      acc.push({
        id: project.project_manager.id,
        name: `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim()
      });
    }
    return acc;
  }, [] as Array<{id: string, name: string}>);

  // Week options for the dropdown (excluding 4 weeks)
  const weekOptions = [
    { value: '8', label: '8 Weeks' },
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '26', label: '26 Weeks' },
    { value: '52', label: '52 Weeks' },
  ];

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background flex flex-col" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}>
            <div className="flex flex-col max-w-full">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Project Resourcing</h1>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Week selector in a bordered box */}
                <div className="flex border rounded-md p-2 items-center">
                  <WeekSelector
                    selectedWeek={selectedWeek}
                    onPreviousWeek={goToPreviousWeek}
                    onNextWeek={goToNextWeek}
                    weekLabel={weekLabel(selectedWeek)}
                  />
                  
                  {/* Weeks dropdown */}
                  <div className="ml-4">
                    <select
                      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={filters.weeksToShow.toString()}
                      onChange={(e) => handleWeeksChange(Number(e.target.value))}
                    >
                      {weekOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Search and filter in a bordered box */}
                <div className="flex items-center border rounded-md p-2 gap-2 flex-1 max-w-md">
                  <div className="flex-1">
                    <SearchInput 
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search projects..."
                    />
                  </div>
                  
                  <FilterBar 
                    filters={{
                      office: filters.office,
                      country: filters.country,
                      manager: filters.manager
                    }}
                    onFilterChange={handleFilterChange}
                    weeksToShow={filters.weeksToShow}
                    onWeeksChange={handleWeeksChange}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    officeOptions={officeOptions}
                    countryOptions={countryOptions}
                    managerOptions={managers}
                    weekOptions={weekOptions}
                    hideSearchAndWeeksSelector={true} /* Hide these as we've moved them */
                  />
                </div>
              </div>
              
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <OfficeSettingsProvider>
                  <ResourceAllocationGrid 
                    startDate={selectedWeek}
                    weeksToShow={filters.weeksToShow}
                    filters={{
                      ...filters,
                      searchTerm
                    }}
                  />
                </OfficeSettingsProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectResourcing;
