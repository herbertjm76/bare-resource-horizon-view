
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamAnnualLeaveContent } from '@/components/annual-leave/TeamAnnualLeaveContent';
import { Calendar, Users, Building2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import '@/components/annual-leave/annual-leave.css';

const HEADER_HEIGHT = 56;

const TeamAnnualLeave = () => {
  // State for selected month
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Fetch annual leave data
  const { leaveData, isLoading: isLoadingLeave, updateLeaveHours } = useAnnualLeave(selectedMonth);
  
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
  
  // Handle month change
  const handleMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
  };
  
  // Handle leave hours change
  const handleLeaveChange = (memberId: string, date: string, hours: number) => {
    updateLeaveHours(memberId, date, hours);
  };
  
  const isLoading = isLoadingTeamMembers || isLoadingLeave;

  // Calculate metrics
  const currentMonthLeave = Object.values(leaveData || {}).reduce((total, memberLeave) => {
    return total + Object.values(memberLeave || {}).reduce((sum, hours) => sum + (hours || 0), 0);
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
                    <Calendar className="h-8 w-8 text-brand-violet" />
                    Team Annual Leave
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage and track annual leave across your team
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
                        <span className="font-semibold text-emerald-600">{currentMonthLeave}h</span>
                        <span className="text-muted-foreground ml-1">This Month</span>
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

            <TeamAnnualLeaveContent
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              isLoading={isLoading}
              filteredMembers={filteredMembers}
              leaveData={leaveData}
              onLeaveChange={handleLeaveChange}
              departments={departments}
              locations={locations}
              activeFilter={activeFilter}
              filterValue={filterValue}
              searchQuery={searchQuery}
              setActiveFilter={setActiveFilter}
              setFilterValue={setFilterValue}
              setSearchQuery={setSearchQuery}
              clearFilters={clearFilters}
              allMembers={allMembers}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamAnnualLeave;
