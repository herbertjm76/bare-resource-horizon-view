
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

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  // Get the start of the current week (Monday)
  const today = new Date();
  const mondayOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(mondayOfCurrentWeek);
  
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
          <div className="flex-1 p-4 sm:p-8 bg-background" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
            <div className="mx-auto space-y-6 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Project Resourcing</h1>
              </div>
              
              <div className="flex justify-between items-center gap-4 flex-wrap">
                <WeekSelector
                  selectedWeek={selectedWeek}
                  onPreviousWeek={goToPreviousWeek}
                  onNextWeek={goToNextWeek}
                  weekLabel={weekLabel(selectedWeek)}
                />
                
                <FilterBar 
                  filters={{
                    office: filters.office,
                    country: filters.country,
                    manager: filters.manager
                  }}
                  onFilterChange={handleFilterChange}
                  weeksToShow={filters.weeksToShow}
                  onWeeksChange={handleWeeksChange}
                  officeOptions={officeOptions}
                  countryOptions={countryOptions}
                  managerOptions={managers}
                  weekOptions={weekOptions}
                />
              </div>
              
              <div className="flex-1 rounded-lg border shadow-sm" style={{ display: 'flex', flexDirection: 'column' }}>
                <OfficeSettingsProvider>
                  <ResourceAllocationGrid 
                    startDate={selectedWeek}
                    weeksToShow={filters.weeksToShow}
                    filters={filters}
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
