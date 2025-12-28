import React from 'react';
import { CenteredTabs, CenteredTabItem, TabsContent } from '@/components/ui/centered-tabs';
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

  // Calculate team weekly capacity
  const weeklyCapacity = filteredMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);

  const activeFiltersCount = [activeFilter !== 'all' ? activeFilter : '', searchQuery].filter(Boolean).length;
  
  const showContentLoading = isLoading || isLoadingWorkload;

  return (
    <div className="space-y-0">
      {/* Centered Tabs - Above filter row - Always visible */}
      <CenteredTabs 
        value={viewMode} 
        onValueChange={(v) => setViewMode(v as HeatmapViewMode)}
        tabs={[
          { value: 'actual', label: 'Actual Workload', icon: Activity },
          { value: 'projected', label: 'Projected Demand', icon: TrendingUp },
          { value: 'gap', label: 'Gap Analysis', icon: Minus },
        ]}
      >
        {/* Filter Controls - Below tabs */}
        <div className="py-4">
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
        </div>

        {/* Tab Content - Show skeleton while loading */}
        {showContentLoading ? (
          <div className="px-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
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
                weeklyCapacity={weeklyCapacity}
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
          </>
        )}
      </CenteredTabs>
    </div>
  );
};
