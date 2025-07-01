
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { Briefcase } from 'lucide-react';
import { TeamMember, PendingMember } from '@/components/dashboard/types';
import '@/components/resources/resources-grid.css';
import '@/components/workload/workload.css';

const TeamWorkload = () => {
  // State for selected week (starting Monday) - this is the starting week for the 36-week analysis
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Transform pre-registered members to match PendingMember structure
  const transformedPreRegisteredMembers: PendingMember[] = preRegisteredMembers.map(member => ({
    ...member, // Spread all original properties from the invite
    isPending: true as const
  }));
  
  // Combine active and pre-registered members
  const allMembers: TeamMember[] = [...teamMembers, ...transformedPreRegisteredMembers];
  
  // Debug logging for team members
  console.log('🔍 TEAM WORKLOAD PAGE: Team members data:', {
    activeMembers: teamMembers.length,
    preRegisteredMembers: preRegisteredMembers.length,
    transformedPreRegistered: transformedPreRegisteredMembers.length,
    totalMembers: allMembers.length,
    sampleActiveMembers: teamMembers.slice(0, 3).map(m => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      company_id: m.company_id
    })),
    samplePreRegistered: transformedPreRegisteredMembers.slice(0, 3).map(m => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      isPending: m.isPending
    })),
    companyId: company?.id
  });
  
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
  
  // Debug logging for filtered members
  console.log('🔍 TEAM WORKLOAD PAGE: Filtered members:', {
    filteredCount: filteredMembers.length,
    filteredMembers: filteredMembers.map(m => ({
      id: m.id,
      name: `${m.first_name} ${m.last_name}`,
      company_id: m.company_id,
      isPending: 'isPending' in m ? m.isPending : false
    }))
  });
  
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

  // Format week label for the starting week
  const weekLabel = `Starting Week: ${format(selectedWeek, 'MMM d, yyyy')}`;

  const isLoading = isLoadingTeamMembers;

  return (
    <StandardLayout>
      <div className="space-y-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-brand-violet" />
              Team Workload
            </h1>
            <p className="text-muted-foreground">
              Analyze team workload over a 36-week period starting from your selected week
            </p>
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
        setActiveFilter={(filter: string) => setActiveFilter(filter as any)}
        setFilterValue={setFilterValue}
        setSearchQuery={setSearchQuery}
        clearFilters={clearFilters}
        weekLabel={weekLabel}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />
    </StandardLayout>
  );
};

export default TeamWorkload;
