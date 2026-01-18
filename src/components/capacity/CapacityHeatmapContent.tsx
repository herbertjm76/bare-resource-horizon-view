import React from 'react';
import { CenteredTabs, TabsContent } from '@/components/ui/centered-tabs';
import { TeamMember } from '@/components/dashboard/types';
import { useUnifiedWorkloadData } from '@/components/workload/hooks/useUnifiedWorkloadData';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { Skeleton } from '@/components/ui/skeleton';
import { HeatmapViewMode, HeatmapFilters } from '@/pages/CapacityHeatmap';
import { CapacityHeatmapTable } from './CapacityHeatmapTable';
import { ProjectedDemandView } from './ProjectedDemandView';
import { GapAnalysisView } from './GapAnalysisView';
import { CapacityHeatmapControls } from './CapacityHeatmapControls';
import { MemberFilterRow } from '@/components/resources/MemberFilterRow';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Activity, TrendingUp, Minus } from 'lucide-react';

interface CapacityHeatmapContentProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  selectedWeeks: number;
  onWeeksChange: (weeks: number) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  filters: HeatmapFilters;
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
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
  filters,
  onFilterChange,
  activeFiltersCount,
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
        {/* Week Controls */}
        <div className="py-4 px-4">
          <CapacityHeatmapControls
            selectedWeek={selectedWeek}
            onWeekChange={onWeekChange}
            selectedWeeks={selectedWeeks}
            onWeeksChange={onWeeksChange}
          />
        </div>

        {/* Filter Row and Table - Center aligned container */}
        <div className="flex flex-col items-center w-full">
          {/* Filter Row - Badge-based like Team Leave */}
          <div className="w-full max-w-fit">
            <TooltipProvider>
              <MemberFilterRow
                filters={filters}
                onFilterChange={onFilterChange}
                activeFiltersCount={activeFiltersCount}
                clearFilters={clearFilters}
                searchLabel="Search members"
                searchPlaceholder="Search by name..."
                availableFilterTypes={['department', 'location']}
              />
            </TooltipProvider>
          </div>

          {/* Tab Content - Show skeleton while loading */}
          {showContentLoading ? (
            <div className="px-6 space-y-4 w-full max-w-4xl">
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
            </>
          )}
        </div>

        {/* Other tab content - outside centered container */}
        {!showContentLoading && (
          <>
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