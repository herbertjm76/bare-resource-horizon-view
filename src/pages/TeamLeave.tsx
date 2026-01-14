import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { usePermissions } from '@/hooks/usePermissions';
import { TeamAnnualLeaveContent } from '@/components/annual-leave/TeamAnnualLeaveContent';
import { LeaveApplicationForm } from '@/components/leave/LeaveApplicationForm';
import { MyLeaveRequests } from '@/components/leave/MyLeaveRequests';
import { LeaveApprovalQueue } from '@/components/leave/LeaveApprovalQueue';
import { SendLeaveCalendarDialog } from '@/components/leave/SendLeaveCalendarDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, ClipboardList, CheckSquare } from 'lucide-react';
import { TimeRange } from '@/components/annual-leave/MonthSelector';
import '@/styles/enhanced-tables.css';
import '@/components/annual-leave/annual-leave.css';

const TeamLeave = () => {
  // State for selected month and time range
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [activeTab, setActiveTab] = useState('calendar');

  // Fetch team members data
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  
  // Get company context
  const { company } = useCompany();
  
  // Get permissions to check if user is admin
  const { isAdmin } = usePermissions();
  
  // Fetch pre-registered members
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  // Fetch annual leave data - pass timeRange to fetch data for the correct date range
  const { leaveData, leaveDetails, isLoading: isLoadingLeave, updateLeaveHours } = useAnnualLeave(selectedMonth, timeRange);
  
  // Combine active and pre-registered members
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  
  // Use filtering hook
  const {
    filters,
    onFilterChange,
    filteredMembers,
    activeFiltersCount,
    clearFilters
  } = useTeamFilters(allMembers);
  
  // Handle leave hours change
  const handleLeaveChange = (memberId: string, date: string, hours: number, leaveTypeId?: string) => {
    updateLeaveHours(memberId, date, hours, leaveTypeId);
  };
  
  const isLoading = isLoadingTeamMembers || isLoadingLeave;

  const handleFormSuccess = () => {
    setActiveTab('my-requests');
  };

  return (
    <StandardLayout>
      <div className="relative mb-6">
        <div className="absolute right-0 top-0 z-10">
          <SendLeaveCalendarDialog />
        </div>
        <StandardizedPageHeader
          title="Team Leave"
          description="Manage and track leave allocations for your team members"
          icon={Calendar}
        />
      </div>

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
            isLoading={isLoading}
            filteredMembers={filteredMembers}
            leaveData={leaveData}
            leaveDetails={leaveDetails}
            onLeaveChange={handleLeaveChange}
            filters={filters}
            onFilterChange={onFilterChange}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isAdmin={isAdmin}
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

export default TeamLeave;
