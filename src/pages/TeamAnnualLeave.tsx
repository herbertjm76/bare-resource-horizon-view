
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamAnnualLeaveContent } from '@/components/annual-leave/TeamAnnualLeaveContent';
import { Calendar } from 'lucide-react';
import '@/styles/enhanced-tables.css';
import '@/components/annual-leave/annual-leave.css';

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

  return (
    <StandardLayout>
      <div className="space-y-6">
        {/* Standardized Header with icon and title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Team Annual Leave
          </h1>
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
    </StandardLayout>
  );
};

export default TeamAnnualLeave;
