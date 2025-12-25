import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMember } from '@/components/dashboard/types';
import { useUnifiedWorkloadData } from '@/components/workload/hooks/useUnifiedWorkloadData';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkloadHeaderControls } from '@/components/workload/components/WorkloadHeaderControls';
import { HeatmapViewMode } from '@/pages/CapacityHeatmap';
import { CapacityHeatmapTable } from './CapacityHeatmapTable';
import { ProjectedDemandView } from './ProjectedDemandView';
import { GapAnalysisView } from './GapAnalysisView';
import { Activity, TrendingUp, Minus } from 'lucide-react';

interface CapacityHeatmapContentProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  selectedWeeks: number;
  onWeeksChange: (weeks: number) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  departments: string[];
  locations: string[];
  activeFilter: string;
  filterValue: string;
  searchQuery: string;
  setActiveFilter: (filter: string) => void;
  setFilterValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  weekLabel: string;
  viewMode: HeatmapViewMode;
  setViewMode: (mode: HeatmapViewMode) => void;
}

export const CapacityHeatmapContent: React.FC<CapacityHeatmapContentProps> = ({
  selectedWeek,
  onWeekChange,
  selectedWeeks,
  onWeeksChange,
  isLoading,
  filteredMembers,
  departments,
  locations,
  activeFilter,
  filterValue,
  searchQuery,
  setActiveFilter,
  setFilterValue,
  setSearchQuery,
  clearFilters,
  weekLabel,
  viewMode,
  setViewMode
}) => {
  // Fetch actual workload data
  const { weeklyWorkloadData, isLoading: isLoadingWorkload, weekStartDates } = useUnifiedWorkloadData(
    selectedWeek,
    filteredMembers, 
    selectedWeeks
  );

  // Fetch projected demand data
  const { weeklyDemand, roleNames, isLoading: isLoadingProjection } = useDemandProjection(
    selectedWeek,
    selectedWeeks
  );

  const activeFiltersCount = [activeFilter !== 'all' ? activeFilter : '', searchQuery].filter(Boolean).length;

  if (isLoading || isLoadingWorkload) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <WorkloadHeaderControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        departments={departments}
        locations={locations}
        activeFiltersCount={activeFiltersCount}
        clearFilters={clearFilters}
        selectedWeek={selectedWeek}
        onWeekChange={onWeekChange}
        selectedWeeks={selectedWeeks}
        onWeeksChange={onWeeksChange}
      />

      {/* View Mode Tabs */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs 
            value={viewMode} 
            onValueChange={(v) => setViewMode(v as HeatmapViewMode)}
            className="w-full"
          >
            {/* Centered tabs with distinct styling */}
            <div className="flex justify-center py-4 border-b border-border/50 bg-muted/30">
              <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-background p-1 shadow-sm border border-border/60">
                <TabsTrigger 
                  value="actual" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <Activity className="h-4 w-4" />
                  Actual Workload
                </TabsTrigger>
                <TabsTrigger 
                  value="projected" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="h-4 w-4" />
                  Projected Demand
                </TabsTrigger>
                <TabsTrigger 
                  value="gap" 
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <Minus className="h-4 w-4" />
                  Gap Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="actual" className="mt-0">
              <CapacityHeatmapTable
                members={filteredMembers}
                weeklyWorkloadData={weeklyWorkloadData}
                weekStartDates={weekStartDates}
              />
            </TabsContent>

            <TabsContent value="projected" className="mt-0 px-6 pb-6">
              <ProjectedDemandView
                weeklyDemand={weeklyDemand}
                roleNames={roleNames}
                weekStartDates={weekStartDates}
                isLoading={isLoadingProjection}
              />
            </TabsContent>

            <TabsContent value="gap" className="mt-0 px-6 pb-6">
              <GapAnalysisView
                members={filteredMembers}
                weeklyWorkloadData={weeklyWorkloadData}
                weeklyDemand={weeklyDemand}
                weekStartDates={weekStartDates}
                isLoading={isLoadingProjection}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
