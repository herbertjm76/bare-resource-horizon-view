
import React from 'react';
import { MonthSelector, TimeRange } from './MonthSelector';
import { TeamAnnualLeaveFilters } from './TeamAnnualLeaveFilters';
import { LeaveCalendar } from './LeaveCalendar';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { LeaveDataByDate } from '@/hooks/useAnnualLeave';

interface TeamAnnualLeaveContentProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  leaveData: Record<string, Record<string, number>>;
  leaveDetails?: Record<string, Record<string, LeaveDataByDate>>;
  onLeaveChange: (memberId: string, date: string, hours: number) => void;
  departments: string[];
  locations: string[];
  activeFilter: 'all' | 'department' | 'location';
  filterValue: string;
  searchQuery: string;
  setActiveFilter: (filter: 'all' | 'department' | 'location') => void;
  setFilterValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  allMembers: TeamMember[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const TeamAnnualLeaveContent: React.FC<TeamAnnualLeaveContentProps> = ({
  selectedMonth,
  onMonthChange,
  isLoading,
  filteredMembers,
  leaveData,
  leaveDetails,
  onLeaveChange,
  departments,
  locations,
  activeFilter,
  filterValue,
  searchQuery,
  setActiveFilter,
  setFilterValue,
  setSearchQuery,
  clearFilters,
  allMembers,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
        <MonthSelector 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
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
      
      <div className="border rounded-lg bg-card shadow-sm">
        {filteredMembers.length === 0 && isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No team members found. Try adjusting your filters.
          </div>
        ) : (
          <LeaveCalendar 
            members={filteredMembers}
            selectedMonth={selectedMonth}
            leaveData={leaveData}
            leaveDetails={leaveDetails}
            timeRange={timeRange}
            onLeaveChange={onLeaveChange}
          />
        )}
      </div>
    </div>
  );
};
