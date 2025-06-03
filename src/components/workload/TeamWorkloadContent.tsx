
import React, { useState, useMemo } from 'react';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { TeamAnnualLeaveFilters } from '@/components/annual-leave/TeamAnnualLeaveFilters';
import { WorkloadCalendar } from '@/components/workload/WorkloadCalendar';
import { WorkloadSummary } from '@/components/workload/WorkloadSummary';
import { PeriodViewSelector, PeriodView } from '@/components/workload/PeriodViewSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { useWorkloadData } from '@/components/workload/hooks/useWorkloadData';
import { WorkloadBreakdown } from '@/components/workload/hooks/types';
import { startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import '@/styles/enhanced-tables.css';

interface TeamWorkloadContentProps {
  selectedWeek: Date;
  onWeekChange: (week: Date) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  departments: string[];
  locations: string[];
  activeFilter: 'all' | 'department' | 'location';
  filterValue: string;
  searchQuery: string;
  setActiveFilter: (filter: 'all' | 'department' | 'location') => void;
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
  // State for period view - default to month instead of week
  const [selectedView, setSelectedView] = useState<PeriodView>('month');
  const [periodToShow, setPeriodToShow] = useState(12);
  
  // Calculate the period based on the selected view
  const calculatedPeriod = useMemo(() => {
    switch (selectedView) {
      case 'month':
        return 4; // 4 weeks (roughly 1 month)
      case 'quarter':
        return 12; // 12 weeks (roughly 3 months)
      case 'year':
        return 52; // 52 weeks (1 year)
      default:
        return periodToShow;
    }
  }, [selectedView, periodToShow]);

  // Calculate the start date based on the selected view
  const startDate = useMemo(() => {
    switch (selectedView) {
      case 'month':
        return startOfWeek(startOfMonth(selectedWeek), { weekStartsOn: 1 });
      case 'quarter':
        return startOfWeek(startOfQuarter(selectedWeek), { weekStartsOn: 1 });
      case 'year':
        return startOfWeek(startOfYear(selectedWeek), { weekStartsOn: 1 });
      default:
        return selectedWeek;
    }
  }, [selectedView, selectedWeek]);
  
  // Use the enhanced workload data hook with the calculated start date and period
  const { workloadData, isLoadingWorkload } = useWorkloadData(startDate, filteredMembers, calculatedPeriod);

  // Transform workloadData to the format expected by WorkloadCalendar and WorkloadSummary
  const transformedWorkloadData = useMemo(() => {
    const transformed: Record<string, Record<string, WorkloadBreakdown>> = {};
    
    Object.keys(workloadData).forEach(memberId => {
      const memberData = workloadData[memberId];
      if (memberData && memberData.daily) {
        transformed[memberId] = memberData.daily;
      }
    });
    
    return transformed;
  }, [workloadData]);

  return (
    <div className="mx-auto space-y-4">
      {/* Enhanced Summary Section */}
      {!isLoading && !isLoadingWorkload && (
        <WorkloadSummary 
          members={filteredMembers}
          workloadData={transformedWorkloadData}
          selectedWeek={startDate}
          periodToShow={calculatedPeriod}
        />
      )}
      
      <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Period View Selector */}
          <PeriodViewSelector
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
          
          <TeamAnnualLeaveFilters 
            departments={departments}
            locations={locations}
            activeFilter={activeFilter}
            filterValue={filterValue}
            searchQuery={searchQuery}
            setActiveFilter={setActiveFilter}
            setFilterValue={setFilterValue}
            setSearchQuery={setSearchQuery}
            clearFilters={clearFilters}
            periodToShow={undefined}
            onPeriodChange={undefined}
          />
        </div>
      </div>
      
      <div className="border rounded-lg bg-card shadow-sm">
        {isLoading || isLoadingWorkload ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <WorkloadCalendar 
            members={filteredMembers}
            selectedWeek={startDate}
            workloadData={transformedWorkloadData}
            periodToShow={calculatedPeriod}
          />
        )}
      </div>
    </div>
  );
};
