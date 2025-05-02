
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { FilterBar } from '@/components/resources/FilterBar';
import { format, addDays, addWeeks } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { DateRange } from '@/components/ui/date-range-picker';

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  // Get the start of the current week (Monday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(today.setDate(diff));
  
  // End of current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    weeksToShow: 12, // Default increased to 12 weeks
  });
  
  // Use a date range instead of just a start date
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfWeek,
    to: addDays(startOfWeek, (filters.weeksToShow * 7) - 1)
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
  
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    
    // Calculate the number of weeks in the range
    const diffTime = Math.abs(newRange.to.getTime() - newRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    const diffWeeks = Math.ceil(diffDays / 7);
    
    // Update weeks to show
    setFilters(prev => ({
      ...prev,
      weeksToShow: diffWeeks
    }));
  };
  
  const handleWeeksChange = (weeks: number) => {
    setFilters(prev => ({
      ...prev,
      weeksToShow: weeks
    }));
    
    // Update date range end date based on new weeks
    setDateRange(prev => ({
      ...prev,
      to: addDays(prev.from, (weeks * 7) - 1)
    }));
  };
  
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

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background overflow-hidden">
            <div className="mx-auto space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Project Resourcing</h1>
              </div>
              
              <FilterBar 
                filters={{
                  office: filters.office,
                  country: filters.country,
                  manager: filters.manager
                }}
                onFilterChange={handleFilterChange}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                weeksToShow={filters.weeksToShow}
                onWeeksChange={handleWeeksChange}
                officeOptions={officeOptions}
                countryOptions={countryOptions}
                managerOptions={managers}
              />
              
              <div className="overflow-x-auto w-full rounded-lg border shadow-sm" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <OfficeSettingsProvider>
                  <ResourceAllocationGrid 
                    startDate={dateRange.from}
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
