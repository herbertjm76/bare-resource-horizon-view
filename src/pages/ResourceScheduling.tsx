import React, { useState, useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { CenteredTabs, CenteredTabItem, TabsContent } from '@/components/ui/centered-tabs';
import { GanttChartSquare, Users, Plus } from 'lucide-react';
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
import { useProjects } from '@/hooks/useProjects';
import { NewProjectDialog } from '@/components/projects/NewProjectDialog';
import { Button } from '@/components/ui/button';
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

  // Lift expandedProjects state up so controls and grid share the same state
  const { projects, refetch: refetchProjects } = useProjects(sortBy, sortDirection);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const expandAll = useCallback(() => {
    if (projects) {
      setExpandedProjects(projects.map((p) => p.id));
    }
  }, [projects]);

  const collapseAll = useCallback(() => {
    setExpandedProjects([]);
  }, []);

  const handleToggleProjectExpand = useCallback((projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  }, []);

  return (
    <StandardLayout>
      <div className="w-full h-full flex flex-col">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-0">
            <StandardizedPageHeader
              icon={GanttChartSquare}
              title="Resource Scheduling"
              description="Manage resource allocation across projects and team members"
            >
              <NewProjectDialog
                onProjectCreated={refetchProjects}
                trigger={
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                }
              />
            </StandardizedPageHeader>
          </div>

          {/* Centered Tabs with distinct styling */}
          <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-100">
            <CenteredTabs
              value={activeTab}
              onValueChange={setActiveTab}
              tabs={[
                { value: 'by-project', label: 'By Project', icon: GanttChartSquare },
                { value: 'by-person', label: 'By Person', icon: Users },
              ]}
            >
              <TabsContent value="by-project" className="mt-0 py-3">
                <div className="space-y-4">
                  {/* 1. Available Members Row - always sorted by utilization, NOT filtered */}
                  <div className="px-3 sm:px-6 opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-200">
                    <AvailableMembersRow
                      weekStartDate={weekStartDate}
                      threshold={80}
                    />
                  </div>
                  
                  {/* 2. Combined Controls + Member Filters - grouped in single card */}
                  <div className="px-3 sm:px-6 opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-300">
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
                        expandedProjects={expandedProjects}
                        onExpandAll={expandAll}
                        onCollapseAll={collapseAll}
                        onToggleProjectExpand={handleToggleProjectExpand}
                      />
                      <MemberFilterRow
                        filters={memberFilters}
                        onFilterChange={handleMemberFilterChange}
                        activeFiltersCount={activeMemberFiltersCount}
                        clearFilters={clearMemberFilters}
                        searchTerm={projectSearchTerm}
                        onSearchChange={handleProjectSearchChange}
                        searchPlaceholder="Search projects..."
                        availableFilterTypes={['department']}
                      />
                    </div>
                  </div>
                  
                  {/* 3. Grid below */}
                  <div className="overflow-x-auto opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-500">
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
                        memberFilters={memberFilters}
                        expandedProjects={expandedProjects}
                        onExpandAll={expandAll}
                        onCollapseAll={collapseAll}
                        onToggleProjectExpand={handleToggleProjectExpand}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="by-person" className="mt-0 py-3">
                <div className="space-y-4">
                  {/* 1. Available Members Row - always sorted by utilization, NOT filtered */}
                  <div className="px-3 sm:px-6 opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-200">
                    <AvailableMembersRow
                      weekStartDate={weekStartDate}
                      threshold={80}
                    />
                  </div>
                  
                  {/* 2. Combined Controls + Member Filters - grouped in single card */}
                  <div className="px-3 sm:px-6 opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-300">
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
                  <div className="overflow-x-auto opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-500">
                    <div className="px-3 sm:px-6">
                      <PersonResourceView
                        startDate={selectedMonth}
                        periodToShow={filters.periodToShow}
                        displayOptions={displayOptions}
                        onMonthChange={handleMonthChange}
                        onPeriodChange={handlePeriodChange}
                        showOnlyGrid={true}
                        memberFilters={memberFilters}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

            </CenteredTabs>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default ResourceScheduling;
