
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { TeamUtilizationSummary } from '@/components/resources/components/TeamUtilizationSummary';
import { format } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';

const HEADER_HEIGHT = 56;

const ProjectResourcing = () => {
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    startDate: new Date(),
    weeksToShow: 12, // Default increased to 12 weeks
  });
  
  // Get project data
  const { projects, isLoading: isLoadingProjects } = useProjects();
  
  // Get team members data - passing true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  // Generate week data for utilization summary
  const weeks = Array.from({ length: filters.weeksToShow }, (_, i) => {
    const date = new Date(filters.startDate);
    date.setDate(date.getDate() + (i * 7));
    return { startDate: date };
  });
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
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
          <div className="flex-1 p-4 sm:p-8 bg-background overflow-hidden">
            <div className="mx-auto space-y-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Project Resourcing</h1>
                <div className="text-sm text-muted-foreground">
                  Week of {format(filters.startDate, 'MMM d, yyyy')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <ResourceFilters filters={filters} onFilterChange={handleFilterChange} />
                </div>
                
                <div className="lg:col-span-1">
                  {!isLoadingMembers && teamMembers && (
                    <TeamUtilizationSummary 
                      resources={teamMembers.map(m => ({ 
                        id: m.id, 
                        name: `${m.first_name} ${m.last_name}`
                      }))} 
                      weeks={weeks}
                    />
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto w-full" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <OfficeSettingsProvider>
                  <ResourceAllocationGrid 
                    startDate={filters.startDate}
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
