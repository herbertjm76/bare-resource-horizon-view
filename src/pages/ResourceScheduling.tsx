import React, { useState, useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChartSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import { MemberFilterRow } from '@/components/resources/MemberFilterRow';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { PersonResourceView } from '@/components/resources/person-view/PersonResourceView';
import { AvailableMembersRow } from '@/components/weekly-rundown/AvailableMembersRow';
import { format, startOfWeek } from 'date-fns';
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

  // Calculate week start date from selected month for the available members row
  const weekStartDate = useMemo(() => {
    const weekStart = startOfWeek(selectedMonth, { weekStartsOn: 1 });
    return format(weekStart, 'yyyy-MM-dd');
  }, [selectedMonth]);

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

          {/* Tabs */}
          <div className="bg-background border-b overflow-hidden">
            <div className="px-3 sm:px-4 py-2 overflow-x-auto scrollbar-hide">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-2 sm:grid sm:grid-cols-4 gap-1 sm:gap-2 flex flex-nowrap rounded-none bg-transparent p-0 min-w-max sm:min-w-0">
                <TabsTrigger
                  value="by-project"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <GanttChartSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">By Project</span>
                </TabsTrigger>
                <TabsTrigger
                  value="by-person"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">By Person</span>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                  disabled
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">Timeline</span>
                  <span className="ml-1 text-[10px] sm:text-xs opacity-60 hidden md:inline">(Soon)</span>
                </TabsTrigger>
                <TabsTrigger
                  value="capacity"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm"
                  disabled
                >
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="font-medium">Capacity</span>
                  <span className="ml-1 text-[10px] sm:text-xs opacity-60 hidden md:inline">(Soon)</span>
                </TabsTrigger>
              </TabsList>

          <TabsContent value="by-project" className="mt-0 py-3">
            <div>
              {/* Member Filter and Available Members */}
              <div className="px-3 sm:px-6">
                <div className="bg-card rounded-lg border p-2 space-y-2">
                  <MemberFilterRow
                    filters={memberFilters}
                    onFilterChange={handleMemberFilterChange}
                    activeFiltersCount={activeMemberFiltersCount}
                    clearFilters={clearMemberFilters}
                  />
                  <AvailableMembersRow
                    weekStartDate={weekStartDate}
                    threshold={80}
                    filters={memberFilters}
                  />
                </div>
              </div>
              
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
                />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="by-person" className="mt-0 py-3">
            <div>
              {/* Member Filter and Available Members */}
              <div className="px-3 sm:px-6">
                <div className="bg-card rounded-lg border p-2 space-y-2">
                  <MemberFilterRow
                    filters={memberFilters}
                    onFilterChange={handleMemberFilterChange}
                    activeFiltersCount={activeMemberFiltersCount}
                    clearFilters={clearMemberFilters}
                  />
                  <AvailableMembersRow
                    weekStartDate={weekStartDate}
                    threshold={80}
                    filters={memberFilters}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="px-3 sm:px-6">
                  <PersonResourceView
                  startDate={selectedMonth}
                  periodToShow={filters.periodToShow}
                  displayOptions={displayOptions}
                  onMonthChange={handleMonthChange}
                  onPeriodChange={handlePeriodChange}
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

          <TabsContent value="capacity" className="mt-0 py-3">
            <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-border rounded-xl bg-muted/20">
              <div className="text-center px-6">
                <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4">
                  <TrendingUp className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Capacity Planning Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Future weeks heatmap showing team capacity, availability, and resource constraints
                </p>
              </div>
            </div>
          </TabsContent>
          </Tabs>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default ResourceScheduling;
