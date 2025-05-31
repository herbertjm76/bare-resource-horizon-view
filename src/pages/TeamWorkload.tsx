
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';
import { StandardizedPageLayout } from '@/components/dashboard/StandardizedPageLayout';
import { calculateWorkloadMetrics } from '@/components/dashboard/utils/metricsCalculations';
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

  // Calculate metrics for the page
  const metrics = calculateWorkloadMetrics(allMembers, selectedWeek);

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
            <StandardizedPageLayout
              title="Team Workload"
              icon={<Briefcase className="h-8 w-8 text-brand-violet" />}
              metrics={metrics}
              cardTitle="Workload Management"
            >
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
            </StandardizedPageLayout>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamWorkload;
