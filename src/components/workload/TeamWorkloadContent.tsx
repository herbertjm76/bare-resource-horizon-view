
import React from 'react';
import { MonthSelector } from '@/components/annual-leave/MonthSelector';
import { TeamAnnualLeaveFilters } from '@/components/annual-leave/TeamAnnualLeaveFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadCalendar } from '@/components/workload/WorkloadCalendar';
import { useWorkloadData } from '@/components/workload/hooks/useWorkloadData';

interface TeamWorkloadContentProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
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
}

export const TeamWorkloadContent: React.FC<TeamWorkloadContentProps> = ({
  selectedMonth,
  onMonthChange,
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
  clearFilters
}) => {
  // Use custom hook to fetch workload data
  const { workloadData, isLoadingWorkload } = useWorkloadData(selectedMonth, filteredMembers);
  
  const isLoadingContent = isLoading || isLoadingWorkload;

  return (
    <div className="mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Team Workload</h1>
      
      <div className="text-sm text-muted-foreground">
        <p>View the total workload allocation for each team member across all projects.</p>
      </div>
      
      <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            onMonthChange={onMonthChange} 
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
          />
        </div>
      </div>
      
      <div className="border rounded-lg bg-card shadow-sm">
        {isLoadingContent ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <WorkloadCalendar 
            members={filteredMembers}
            selectedMonth={selectedMonth}
            workloadData={workloadData}
          />
        )}
      </div>
    </div>
  );
};
