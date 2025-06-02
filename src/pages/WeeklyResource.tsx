
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { useWeekResourceData } from '@/components/week-resourcing/hooks/useWeekResourceData';
import { useResourceTableData } from '@/hooks/useResourceTableData';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResourceTableRow } from '@/components/week-resourcing/row/ResourceTableRow';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeeklyResource = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [filters, setFilters] = useState({
    office: 'all',
    searchTerm: ''
  });

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate week label
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = format(weekStart, 'MMM d, yyyy');

  // Get data using the week resource hooks
  const {
    projects,
    members,
    weekAllocations,
    weekStartDate,
    isLoading,
    error
  } = useWeekResourceData({ selectedWeek, filters });

  // Get table data and handlers
  const {
    allocationMap,
    projectCountByMember,
    manualLeaveData,
    remarksData,
    getWeeklyLeave,
    getTotalWeeklyLeaveHours,
    handleLeaveInputChange,
    handleRemarksUpdate
  } = useResourceTableData(projects, members, weekAllocations, weekStartDate);

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-lg text-red-600">Error: {error.message}</div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Weekly Resource Planning</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">{weekLabel}</span>
              <Button variant="outline" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-brand-primary">
                <TableRow>
                  <TableHead className="text-white sticky-column sticky-left-0 w-[150px]">Name</TableHead>
                  <TableHead className="text-white text-center w-[60px]"># Projects</TableHead>
                  <TableHead className="text-white text-center w-[80px]">Capacity</TableHead>
                  <TableHead className="text-white text-center w-[60px]">AL</TableHead>
                  <TableHead className="text-white text-center w-[60px]">Holiday</TableHead>
                  <TableHead className="text-white text-center w-[60px]">Other</TableHead>
                  <TableHead className="text-white text-center w-[80px]">Office</TableHead>
                  {projects.map((project, index) => (
                    <TableHead key={project.id} className="text-white text-center w-[40px]">
                      P{index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, idx) => {
                  const weeklyCapacity = member.weekly_capacity || 40;
                  const totalHours = allocationMap.get(member.id) || 0;
                  const annualLeave = getTotalWeeklyLeaveHours(member.id);
                  const projectCount = projectCountByMember.get(member.id) || 0;
                  const leaveDays = getWeeklyLeave(member.id);

                  return (
                    <ResourceTableRow
                      key={member.id}
                      member={member}
                      projects={projects}
                      idx={idx}
                      weekStartDate={weekStartDate}
                      allocationMap={allocationMap}
                      projectCount={projectCount}
                      manualLeaveData={manualLeaveData}
                      remarksData={remarksData}
                      leaveDays={leaveDays}
                      weeklyCapacity={weeklyCapacity}
                      totalHours={totalHours}
                      annualLeave={annualLeave}
                      onLeaveInputChange={handleLeaveInputChange}
                      onRemarksUpdate={handleRemarksUpdate}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WeeklyResource;
