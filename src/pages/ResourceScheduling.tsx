import React, { useState, useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChartSquare, Users, Calendar } from 'lucide-react';
import { MemberFilterRow } from '@/components/resources/MemberFilterRow';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { PersonResourceView } from '@/components/resources/person-view/PersonResourceView';
import { AvailableMembersRow } from '@/components/weekly-rundown/AvailableMembersRow';
import { format } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
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
    sortBy,
    sortDirection,
    handleFilterChange,
    handlePeriodChange,
    handleDisplayOptionChange,
    handleSearchChange: handleProjectSearchChange,
    handleMonthChange,
    handleSortChange,
    handleSortDirectionToggle,
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

  const { startOfWorkWeek } = useAppSettings();
  
  // Calculate week start date from selected month for the available members row
  const weekStartDate = useMemo(() => {
    const weekStart = getWeekStartDate(selectedMonth, startOfWorkWeek);
    return format(weekStart, 'yyyy-MM-dd');
  }, [selectedMonth, startOfWorkWeek]);

  // Member filters state
  const [memberFilters, setMemberFilters] = useState({
    practiceArea: "all",
    department: "all",
    location: "all",
    searchTerm: ""
  });

  const handleMemberFilterChange = useCallback((key: string, value: string) => {
    setMemberFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearMemberFilters = useCallback(() => {
    setMemberFilters({
      practiceArea: 'all',
      department: 'all',
      location: 'all',
      searchTerm: ''
    });
  }, []);

  const activeMemberFiltersCount = useMemo(() => [
    memberFilters.practiceArea !== 'all' ? 'practiceArea' : '',
    memberFilters.department !== 'all' ? 'department' : '',
    memberFilters.location !== 'all' ? 'location' : '',
    memberFilters.searchTerm ? 'search' : ''
  ].filter(Boolean).length, [memberFilters.practiceArea, memberFilters.department, memberFilters.location, memberFilters.searchTerm]);

  return (
    <StandardLayout>
      <div className="w-full h-full flex flex-col">
        <div className="max-w-[1600px] mx-auto w-full">
          <StandardizedPageHeader
            icon={GanttChartSquare}
            title="Resource Scheduling"
            description="Manage resource allocation across projects and team members"
          />

          {/* Centered Tabs with distinct styling */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center py-4 border-b border-border/50 bg-muted/30">
              <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-background p-1 shadow-sm border border-border/60">
                <TabsTrigger
                  value="by-project"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <GanttChartSquare className="h-4 w-4" />
                  By Project
                </TabsTrigger>
                <TabsTrigger
                  value="by-person"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <Users className="h-4 w-4" />
                  By Person
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm opacity-60"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                  <span className="text-xs opacity-70">(Soon)</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="by-project" className="mt-0 py-3">
              <div className="space-y-4">
                {/* 1. Available Members Row - always sorted by utilization */}
                <div className="px-3 sm:px-6">
                  <AvailableMembersRow
                    weekStartDate={weekStartDate}
                    threshold={80}
                    filters={memberFilters}
                  />
                </div>
                
                {/* 2. Combined Controls + Member Filters - grouped in single card */}
                <div className="px-3 sm:px-6">
                  <div className="bg-card rounded-lg border shadow-sm">
                    <ProjectResourcingContent
                      selectedMonth={selectedMonth}
                      searchTerm={projectSearchTerm}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
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
                      onSortChange={handleSortChange}
                      onSortDirectionToggle={handleSortDirectionToggle}
                      onDisplayOptionChange={handleDisplayOptionChange}
                      onClearFilters={clearProjectFilters}
                      showOnlyControls={true}
                    />
                    <MemberFilterRow
                      filters={memberFilters}
                      onFilterChange={handleMemberFilterChange}
                      activeFiltersCount={activeMemberFiltersCount}
                      clearFilters={clearMemberFilters}
                    />
                  </div>
                </div>
                
                {/* 3. Grid below */}
                <div className="overflow-x-auto">
                  <div className="px-3 sm:px-6">
                    <ProjectResourcingContent
                      selectedMonth={selectedMonth}
                      searchTerm={projectSearchTerm}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
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
                      onSortChange={handleSortChange}
                      onSortDirectionToggle={handleSortDirectionToggle}
                      onDisplayOptionChange={handleDisplayOptionChange}
                      onClearFilters={clearProjectFilters}
                      showOnlyGrid={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="by-person" className="mt-0 py-3">
              <div className="space-y-4">
                {/* 1. Available Members Row - always sorted by utilization */}
                <div className="px-3 sm:px-6">
                  <AvailableMembersRow
                    weekStartDate={weekStartDate}
                    threshold={80}
                    filters={memberFilters}
                  />
                </div>
                
                {/* 2. Combined Controls + Member Filters - grouped in single card */}
                <div className="px-3 sm:px-6">
                  <div className="bg-card rounded-lg border shadow-sm">
                    <PersonResourceView
                      startDate={selectedMonth}
                      periodToShow={filters.periodToShow}
                      displayOptions={displayOptions}
                      onMonthChange={handleMonthChange}
                      onPeriodChange={handlePeriodChange}
                      showOnlyControls={true}
                    />
                    <MemberFilterRow
                      filters={memberFilters}
                      onFilterChange={handleMemberFilterChange}
                      activeFiltersCount={activeMemberFiltersCount}
                      clearFilters={clearMemberFilters}
                    />
                  </div>
                </div>
                
                {/* 3. Grid below */}
                <div className="overflow-x-auto">
                  <div className="px-3 sm:px-6">
                    <PersonResourceView
                      startDate={selectedMonth}
                      periodToShow={filters.periodToShow}
                      displayOptions={displayOptions}
                      onMonthChange={handleMonthChange}
                      onPeriodChange={handlePeriodChange}
                      showOnlyGrid={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0 py-3">
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
