
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
import { BarChart3, Users, Building2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
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

  // Calculate total weekly capacity
  const totalCapacity = allMembers.reduce((total, member) => {
    return total + (member.weekly_capacity || 40);
  }, 0);

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
                    <BarChart3 className="h-8 w-8 text-brand-violet" />
                    Team Workload
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Monitor and balance team workload across projects
                  </p>
                </div>
                
                {/* Quick Stats Cards */}
                <div className="flex flex-wrap items-center gap-3">
                  <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-violet" />
                      <div className="text-sm">
                        <span className="font-semibold text-brand-violet">{allMembers.length}</span>
                        <span className="text-muted-foreground ml-1">Members</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <div className="text-sm">
                        <span className="font-semibold text-emerald-600">{totalCapacity}h</span>
                        <span className="text-muted-foreground ml-1">Capacity</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      <div className="text-sm">
                        <span className="font-semibold text-blue-600">{locations.length}</span>
                        <span className="text-muted-foreground ml-1">Offices</span>
                      </div>
                    </div>
                  </Card>
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
