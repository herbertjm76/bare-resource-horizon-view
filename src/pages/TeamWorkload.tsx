
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { Briefcase } from 'lucide-react';
import '@/components/resources/resources-grid.css';
import '@/components/workload/workload.css';

const HEADER_HEIGHT = 56;

const TeamWorkload = () => {
  // State for selected week (starting Monday)
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Combine active and pre-registered members
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  
  // Use filtering hook
  const {
    activeFilter,
    setActiveFilter,
    filterValue,
    setFilterValue,
    searchQuery,
    setSearchQuery,
    departments,
    locations,
    filteredMembers,
    clearFilters
  } = useTeamFilters(allMembers);
  
  // Handle week navigation
  const handleWeekChange = (newWeek: Date) => {
    setSelectedWeek(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  // Format week label
  const weekLabel = `Week of ${format(selectedWeek, 'MMMM d, yyyy')}`;

  const isLoading = isLoadingTeamMembers;

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            {/* Modern Header Section */}
            <div className="space-y-6 mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-brand-violet" />
                    Team Workload
                  </h1>
                </div>
              </div>
            </div>

            <TeamWorkloadContent
              selectedWeek={selectedWeek}
              onWeekChange={handleWeekChange}
              isLoading={isLoading}
              filteredMembers={filteredMembers}
              departments={departments}
              locations={locations}
              activeFilter={activeFilter}
              filterValue={filterValue}
              searchQuery={searchQuery}
              setActiveFilter={setActiveFilter}
              setFilterValue={setFilterValue}
              setSearchQuery={setSearchQuery}
              clearFilters={clearFilters}
              weekLabel={weekLabel}
              onPreviousWeek={handlePreviousWeek}
              onNextWeek={handleNextWeek}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamWorkload;
