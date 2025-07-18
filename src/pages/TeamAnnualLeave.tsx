
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
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
      <StandardizedPageHeader
        title="Team Annual Leave"
        description="Manage and track annual leave allocations for your team members"
        icon={Calendar}
      />

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
    </StandardLayout>
  );
};

export default TeamAnnualLeave;
