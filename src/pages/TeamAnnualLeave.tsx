import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { TeamAnnualLeaveContent } from '@/components/annual-leave/TeamAnnualLeaveContent';
import { LeaveApplicationForm } from '@/components/leave/LeaveApplicationForm';
import { MyLeaveRequests } from '@/components/leave/MyLeaveRequests';
import { LeaveApprovalQueue } from '@/components/leave/LeaveApprovalQueue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, ClipboardList, CheckSquare } from 'lucide-react';
import { TimeRange } from '@/components/annual-leave/MonthSelector';
import '@/styles/enhanced-tables.css';
import '@/components/annual-leave/annual-leave.css';

const TeamAnnualLeave = () => {
  // State for selected month and time range
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [activeTab, setActiveTab] = useState('calendar');

  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Fetch annual leave data
  const { leaveData, leaveDetails, isLoading: isLoadingLeave, updateLeaveHours } = useAnnualLeave(selectedMonth);
  
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

  const handleFormSuccess = () => {
    setActiveTab('my-requests');
  };

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Team Annual Leave"
        description="Manage and track annual leave allocations for your team members"
        icon={Calendar}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 mx-auto flex w-fit">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="apply" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Apply for Leave
          </TabsTrigger>
          <TabsTrigger value="my-requests" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            My Requests
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <TeamAnnualLeaveContent
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            isLoading={isLoading}
            filteredMembers={filteredMembers}
            leaveData={leaveData}
            leaveDetails={leaveDetails}
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
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </TabsContent>

        <TabsContent value="apply">
          <LeaveApplicationForm onSuccess={handleFormSuccess} />
        </TabsContent>

        <TabsContent value="my-requests">
          <MyLeaveRequests />
        </TabsContent>

        <TabsContent value="approvals">
          <LeaveApprovalQueue active={activeTab === 'approvals'} />
        </TabsContent>
      </Tabs>
    </StandardLayout>
  );
};

export default TeamAnnualLeave;
