import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
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
    <StandardLayout contentClassName="p-0">
      <div className="w-full h-full flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))] px-4 sm:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <GanttChartSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Resource Scheduling</h1>
              <p className="text-white/80 text-sm mt-1">Manage resource allocation across projects and team members</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-background border-b px-4 sm:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-2xl h-14 bg-muted/50 p-1">
              <TabsTrigger value="by-project" className="flex-1 flex items-center justify-center gap-2 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <GanttChartSquare className="h-4 w-4" />
                <span className="font-medium">By Project</span>
              </TabsTrigger>
              <TabsTrigger value="by-person" className="flex-1 flex items-center justify-center gap-2 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                <span className="font-medium">By Person</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1 flex items-center justify-center gap-2 h-full" disabled>
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Timeline</span>
                <span className="ml-1 text-xs opacity-60">(Soon)</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="by-project" className="mt-0 px-4 sm:px-8 py-6">
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

          <TabsContent value="by-person" className="mt-0 px-4 sm:px-8 py-6">
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

          <TabsContent value="timeline" className="mt-0 px-4 sm:px-8 py-6">
            <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-border rounded-xl bg-muted/20">
              <div className="text-center px-6">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Timeline Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Interactive Gantt-style timeline for drag-and-drop resource allocation across multiple weeks
                </p>
              </div>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </StandardLayout>
  );
};

export default ResourceScheduling;
