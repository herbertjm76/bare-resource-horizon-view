
import React from 'react';
import { MonthSelector } from './MonthSelector';
import { TeamAnnualLeaveFilters } from './TeamAnnualLeaveFilters';
import { LeaveCalendar } from './LeaveCalendar';
import { AnnualLeaveInsights } from './AnnualLeaveInsights';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';

interface TeamAnnualLeaveContentProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  leaveData: any;
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
  summaryFormat: 'simple' | 'detailed';
  setSummaryFormat: (format: 'simple' | 'detailed') => void;
}

export const TeamAnnualLeaveContent: React.FC<TeamAnnualLeaveContentProps> = ({
  selectedMonth,
  onMonthChange,
  isLoading,
  filteredMembers,
  leaveData,
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
  summaryFormat,
  setSummaryFormat
}) => {
  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Team Annual Leave</h1>
        <div className="flex gap-2">
          <Button
            variant={summaryFormat === 'simple' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSummaryFormat('simple')}
          >
            Simple Cards
          </Button>
          <Button
            variant={summaryFormat === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSummaryFormat('detailed')}
          >
            Detailed Cards
          </Button>
        </div>
      </div>

      {/* Annual Leave Insights */}
      <AnnualLeaveInsights 
        teamMembers={allMembers} 
        selectedMonth={selectedMonth} 
        summaryFormat={summaryFormat}
      />
      
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
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <LeaveCalendar 
            members={filteredMembers}
            selectedMonth={selectedMonth}
            leaveData={leaveData}
            onLeaveChange={onLeaveChange}
          />
        )}
      </div>
    </div>
  );
};
