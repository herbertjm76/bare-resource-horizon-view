import React from 'react';
import { MonthSelector, TimeRange } from './MonthSelector';
import { TeamAnnualLeaveFilters } from './TeamAnnualLeaveFilters';
import { LeaveCalendar } from './LeaveCalendar';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { LeaveDataByDate } from '@/hooks/useAnnualLeave';
import { TeamFilters } from '@/hooks/useTeamFilters';

interface TeamAnnualLeaveContentProps {
  selectedMonth: Date;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  leaveData: Record<string, Record<string, number>>;
  leaveDetails?: Record<string, Record<string, LeaveDataByDate>>;
  onLeaveChange: (memberId: string, date: string, hours: number) => void;
  filters: TeamFilters;
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const TeamAnnualLeaveContent: React.FC<TeamAnnualLeaveContentProps> = ({
  selectedMonth,
  isLoading,
  filteredMembers,
  leaveData,
  leaveDetails,
  onLeaveChange,
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters,
  timeRange,
  onTimeRangeChange
}) => {
  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-row justify-center items-center gap-4 flex-wrap">
        <MonthSelector 
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />
      </div>

      <div className="w-full overflow-hidden">
        <TeamAnnualLeaveFilters 
          filters={filters}
          onFilterChange={onFilterChange}
          activeFiltersCount={activeFiltersCount}
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
