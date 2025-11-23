import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChartSquare, Users, Calendar } from 'lucide-react';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { TeamWorkloadContent } from '@/components/workload/TeamWorkloadContent';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useTeamFilters } from '@/hooks/useTeamFilters';
import { startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { TeamMember, PendingMember } from '@/components/dashboard/types';
import '@/components/resources/resources-grid.css';
import '@/components/workload/workload.css';

const ResourceScheduling = () => {
  const [activeTab, setActiveTab] = useState<string>('by-project');
  
  // Project Resourcing State
  const {
    selectedMonth,
    searchTerm: projectSearchTerm,
    filters,
    displayOptions,
    handleFilterChange,
    handlePeriodChange,
    handleDisplayOptionChange,
    handleSearchChange: handleProjectSearchChange,
    handleMonthChange,
    setFilters,
    setSearchTerm: setProjectSearchTerm,
    setDisplayOptions
  } = useProjectResourcingState();

  const {
    officeOptions,
    countryOptions,
    managers
  } = useProjectResourcingData();

  const activeFiltersCount = calculateActiveFiltersCount(filters, projectSearchTerm, displayOptions);
  
  const clearProjectFilters = createClearFiltersFunction(
    setFilters,
    setProjectSearchTerm,
    setDisplayOptions,
    filters.periodToShow
  );

  // Team Workload State
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedWeeks, setSelectedWeeks] = useState<number>(24);
  
  const { teamMembers, isLoading: isLoadingTeamMembers } = useTeamMembersData(true);
  const { company } = useCompany();
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  
  const transformedPreRegisteredMembers: PendingMember[] = preRegisteredMembers.map(member => ({
    ...member,
    isPending: true as const
  }));
  
  const allMembers: TeamMember[] = [...teamMembers, ...transformedPreRegisteredMembers];
  
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
    clearFilters: clearTeamFilters
  } = useTeamFilters(allMembers);
  
  // Create wrapper functions for team filter handlers
  const handleTeamFilterChange = (filter: string) => {
    setActiveFilter(filter as 'all' | 'department' | 'location');
  };
  
  const handleTeamFilterValueChange = (value: string) => {
    setFilterValue(value);
  };
  
  const handleTeamSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleWeekChange = (newWeek: Date) => {
    setSelectedWeek(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handleWeeksChange = (weeks: number) => {
    setSelectedWeeks(weeks);
  };

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  return (
    <StandardLayout>
      <div className="max-w-full">
        <StandardizedPageHeader
          icon={GanttChartSquare}
          title="Resource Scheduling"
          description="Manage resource allocation across projects and team members"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="by-project" className="flex items-center gap-2">
              <GanttChartSquare className="h-4 w-4" />
              By Project
            </TabsTrigger>
            <TabsTrigger value="by-person" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              By Person
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2" disabled>
              <Calendar className="h-4 w-4" />
              Timeline
              <span className="ml-1 text-xs text-muted-foreground">(Soon)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="by-project" className="mt-6">
            <ProjectResourcingContent
              selectedMonth={selectedMonth}
              searchTerm={projectSearchTerm}
              filters={filters}
              displayOptions={displayOptions}
              officeOptions={officeOptions}
              countryOptions={countryOptions}
              managers={managers}
              activeFiltersCount={activeFiltersCount}
              onMonthChange={handleMonthChange}
              onSearchChange={handleProjectSearchChange}
              onFilterChange={handleFilterChange}
              onPeriodChange={handlePeriodChange}
              onDisplayOptionChange={handleDisplayOptionChange}
              onClearFilters={clearProjectFilters}
            />
          </TabsContent>

          <TabsContent value="by-person" className="mt-6">
            <TeamWorkloadContent
              filteredMembers={filteredMembers}
              isLoading={isLoadingTeamMembers}
              selectedWeek={selectedWeek}
              selectedWeeks={selectedWeeks}
              activeFilter={activeFilter}
              filterValue={filterValue}
              searchQuery={searchQuery}
              departments={departments}
              locations={locations}
              weekLabel={`Week of ${selectedWeek.toLocaleDateString()}`}
              onWeekChange={handleWeekChange}
              onWeeksChange={handleWeeksChange}
              onPreviousWeek={handlePreviousWeek}
              onNextWeek={handleNextWeek}
              setActiveFilter={handleTeamFilterChange}
              setFilterValue={handleTeamFilterValueChange}
              setSearchQuery={handleTeamSearchChange}
              clearFilters={clearTeamFilters}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Visual Timeline Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Interactive Gantt-style timeline for drag-and-drop resource allocation across multiple weeks
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
};

export default ResourceScheduling;
