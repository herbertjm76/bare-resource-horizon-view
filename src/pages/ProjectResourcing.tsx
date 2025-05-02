
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { format, addWeeks, subWeeks } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handlePreviousWeek = () => {
    handleFilterChange({ startDate: subWeeks(filters.startDate, 1) });
  };
  
  const handleNextWeek = () => {
    handleFilterChange({ startDate: addWeeks(filters.startDate, 1) });
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
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Week Selector - Moved to the left */}
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={handlePreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex items-center px-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Week of {format(filters.startDate, 'MMM d, yyyy')}
                    </span>
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Resource Filters - Now to the right of the week selector */}
                <ResourceFilters filters={filters} onFilterChange={handleFilterChange} />
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
