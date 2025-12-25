import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Capacity Analysis ({selectedWeeks} weeks)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs 
            value={viewMode} 
            onValueChange={(v) => setViewMode(v as HeatmapViewMode)}
            className="w-full"
          >
            <div className="px-6 pb-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="actual" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Actual
                </TabsTrigger>
                <TabsTrigger value="projected" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Projected
                </TabsTrigger>
                <TabsTrigger value="gap" className="flex items-center gap-2">
                  <Minus className="h-4 w-4" />
                  Gap
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
