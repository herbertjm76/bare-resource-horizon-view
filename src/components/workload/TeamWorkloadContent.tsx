
import React, { useState } from 'react';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { TeamAnnualLeaveFilters } from '@/components/annual-leave/TeamAnnualLeaveFilters';
import { WorkloadCalendar } from '@/components/workload/WorkloadCalendar';
import { WorkloadSummary } from '@/components/workload/WorkloadSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { useWorkloadData, WorkloadBreakdown } from '@/components/workload/hooks/useWorkloadData';
import { MemberWorkloadData } from '@/components/workload/hooks/types';
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
  // State for period selector
  const [periodToShow, setPeriodToShow] = useState(12);
  
  // Use the enhanced workload data hook with the selected week
  const { workloadData, isLoadingWorkload } = useWorkloadData(selectedWeek, filteredMembers);

  return (
    <div className="mx-auto space-y-4">
      {/* Enhanced Summary Section */}
      {!isLoading && !isLoadingWorkload && (
        <WorkloadSummary 
          members={filteredMembers}
          workloadData={workloadData as Record<string, MemberWorkloadData>}
          selectedWeek={selectedWeek}
          periodToShow={periodToShow}
        />
      )}
      
      <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <WeekSelector 
            selectedWeek={selectedWeek}
            onPreviousWeek={onPreviousWeek}
            onNextWeek={onNextWeek}
            weekLabel={weekLabel}
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
            periodToShow={periodToShow}
            onPeriodChange={setPeriodToShow}
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
          <div className="enhanced-table-scroll">
            <div className="enhanced-table-container">
              <WorkloadCalendar 
                members={filteredMembers}
                selectedWeek={selectedWeek}
                workloadData={workloadData as Record<string, MemberWorkloadData>}
                periodToShow={periodToShow}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
