
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadCalendar } from './WeeklyWorkloadCalendar';
import { useWeeklyWorkloadData } from './hooks/useWeeklyWorkloadData';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkloadHeaderControls } from './components/WorkloadHeaderControls';
import { WorkloadMetricsCards } from './components/WorkloadMetricsCards';
import { PopulateDummyDataButton } from './PopulateDummyDataButton';

interface TeamWorkloadContentProps {
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
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const TeamWorkloadContent: React.FC<TeamWorkloadContentProps> = ({
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
  onPreviousWeek,
  onNextWeek
}) => {
  // Use the selected week period instead of fixed 36 weeks
  const { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  } = useWeeklyWorkloadData(selectedWeek, filteredMembers, selectedWeeks);

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

      {/* Workload Summary Stats */}
      <WorkloadMetricsCards
        weeklyWorkloadData={weeklyWorkloadData}
        filteredMembers={filteredMembers}
        periodWeeks={selectedWeeks}
      />

      {/* Weekly Workload Calendar */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Weekly Team Workload ({selectedWeeks} weeks)
            </CardTitle>
            <PopulateDummyDataButton />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <WeeklyWorkloadCalendar
            members={filteredMembers}
            weeklyWorkloadData={weeklyWorkloadData}
            weekStartDates={weekStartDates}
          />
        </CardContent>
      </Card>
    </div>
  );
};
