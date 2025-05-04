
import React, { useState, useCallback, useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { FilterPopover } from '@/components/filters/FilterPopover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterBadges } from '@/components/resources/filters/FilterBadges';

const HEADER_HEIGHT = 56;

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
    return `Week of ${format(date, 'MMM d, yyyy')}`;
  }, []);
  
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

  // Week options for the dropdown (excluding 4 weeks)
  const weekOptions = [
    { value: '8', label: '8 Weeks' },
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '26', label: '26 Weeks' },
    { value: '52', label: '52 Weeks' },
  ];

  // Calculate active filters count
  const activeFiltersCount = 
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0);
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      office: "all",
      country: "all",
      manager: "all",
      weeksToShow: filters.weeksToShow // Keep the weeks setting
    });
    setSearchTerm('');
  };

  // Render filter content
  const renderFilterContent = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Office</label>
          <Select 
            value={filters.office}
            onValueChange={(value) => handleFilterChange('office', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Offices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              {officeOptions.map((office) => (
                <SelectItem key={office} value={office}>
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Select 
            value={filters.country}
            onValueChange={(value) => handleFilterChange('country', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countryOptions.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Manager</label>
          <Select 
            value={filters.manager}
            onValueChange={(value) => handleFilterChange('manager', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Project Managers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Project Managers</SelectItem>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Weeks to Show</label>
          <Select
            value={filters.weeksToShow.toString()}
            onValueChange={(value) => handleWeeksChange(Number(value))}
          >
            {weekOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        {/* Active filter badges */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <FilterBadges 
              filters={filters}
              onFilterChange={handleFilterChange}
              managerOptions={managers}
              officeOptions={officeOptions}
              countryOptions={countryOptions}
            />
            {searchTerm && (
              <div className="mt-2 inline-flex items-center bg-muted/40 rounded-full text-xs py-1 pl-3 pr-1.5">
                <span className="mr-1">Search: {searchTerm}</span>
                <button 
                  className="h-5 w-5 p-0 rounded-full inline-flex items-center justify-center hover:bg-muted/60"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
                  
                  <FilterPopover
                    activeFiltersCount={activeFiltersCount}
                    onClearFilters={clearFilters}
                  >
                    {renderFilterContent()}
                  </FilterPopover>
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
