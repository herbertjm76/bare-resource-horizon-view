
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { Briefcase } from 'lucide-react';
import '@/components/resources/resources-grid.css';
import '@/components/workload/workload.css';

const TeamWorkload = () => {
  // State for selected week (starting Monday) - still used for calculations
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
  
  // Handle week navigation (still used for period calculations)
  const handleWeekChange = (newWeek: Date) => {
    setSelectedWeek(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  // Format week label (still used for internal calculations)
  const weekLabel = `Week of ${format(selectedWeek, 'MMMM d, yyyy')}`;

  const isLoading = isLoadingTeamMembers;

  return (
    <StandardLayout>
      <div className="space-y-6">
        {/* Standardized Header with icon and title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Briefcase className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Team Workload
          </h1>
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
    </StandardLayout>
  );
};

export default TeamWorkload;
