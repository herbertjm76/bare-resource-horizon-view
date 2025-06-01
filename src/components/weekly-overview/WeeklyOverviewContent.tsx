
import React from 'react';
import { WeeklyOverviewControls } from './WeeklyOverviewControls';
import { EnhancedWeeklyResourceTable } from './components/EnhancedWeeklyResourceTable';
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyOverviewContentProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeeklyOverviewContent: React.FC<WeeklyOverviewContentProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const {
    members,
    projects,
    memberTotals,
    projectTotals,
    allocationMap,
    weekStartDate,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, filters);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <WeeklyOverviewControls
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          weekLabel={weekLabel}
          filters={filters}
          onFilterChange={onFilterChange}
        />
        <Card className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <WeeklyOverviewControls
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          weekLabel={weekLabel}
          filters={filters}
          onFilterChange={onFilterChange}
        />
        <Card className="p-8">
          <div className="text-center text-red-600">
            Error loading weekly overview data: {error}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WeeklyOverviewControls
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weekLabel={weekLabel}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      
      <Card className="overflow-hidden">
        <EnhancedWeeklyResourceTable
          members={members}
          projects={projects}
          memberTotals={memberTotals}
          projectTotals={projectTotals}
          allocationMap={allocationMap}
          weekStartDate={weekStartDate}
        />
      </Card>
    </div>
  );
};
