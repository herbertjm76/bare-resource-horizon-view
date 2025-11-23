import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GanttChartSquare, Users, Calendar } from 'lucide-react';
import { ProjectResourcingContent } from './ProjectResourcing/components/ProjectResourcingContent';
import { useProjectResourcingState } from './ProjectResourcing/hooks/useProjectResourcingState';
import { useProjectResourcingData } from './ProjectResourcing/hooks/useProjectResourcingData';
import { calculateActiveFiltersCount, createClearFiltersFunction } from './ProjectResourcing/utils/filterUtils';
import { PersonResourceView } from '@/components/resources/person-view/PersonResourceView';
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

  return (
    <StandardLayout>
      <div className="w-full h-full flex flex-col">
        <StandardizedPageHeader
          icon={GanttChartSquare}
          title="Resource Scheduling"
          description="Manage resource allocation across projects and team members"
        />

        {/* Tabs */}
        <div className="bg-background border-b">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-2 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 gap-2 flex-nowrap rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="by-project"
                  className="flex items-center justify-center gap-2 min-w-max px-4 h-10"
                >
                  <GanttChartSquare className="h-4 w-4" />
                  <span className="font-medium text-sm">By Project</span>
                </TabsTrigger>
                <TabsTrigger
                  value="by-person"
                  className="flex items-center justify-center gap-2 min-w-max px-4 h-10"
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium text-sm">By Person</span>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="flex items-center justify-center gap-2 min-w-max px-4 h-10"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-sm">Timeline</span>
                  <span className="ml-1 text-xs opacity-60 hidden md:inline">(Soon)</span>
                </TabsTrigger>
              </TabsList>

          <TabsContent value="by-project" className="mt-0 py-6">
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

          <TabsContent value="by-person" className="mt-0 py-6">
            <PersonResourceView
              startDate={selectedMonth}
              periodToShow={filters.periodToShow}
              displayOptions={displayOptions}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0 py-6">
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
      </div>
    </StandardLayout>
  );
};

export default ResourceScheduling;
