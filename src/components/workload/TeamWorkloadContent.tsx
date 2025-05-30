
import React, { useState } from 'react';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { TeamAnnualLeaveFilters } from '@/components/annual-leave/TeamAnnualLeaveFilters';
import { WorkloadCalendar } from '@/components/workload/WorkloadCalendar';
import { WorkloadSummary } from '@/components/workload/WorkloadSummary';
import { TeamWorkloadHeader } from '@/components/workload/TeamWorkloadHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamMember } from '@/components/dashboard/types';
import { useWorkloadData, WorkloadBreakdown } from '@/components/workload/hooks/useWorkloadData';

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
  summaryFormat: 'simple' | 'detailed';
  setSummaryFormat: (format: 'simple' | 'detailed') => void;
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
  onNextWeek,
  summaryFormat,
  setSummaryFormat
}) => {
  // State for period selector
  const [periodToShow, setPeriodToShow] = useState(12);
  
  // Use the enhanced workload data hook with the selected week
  const { workloadData, isLoadingWorkload } = useWorkloadData(selectedWeek, filteredMembers);

  // Calculate header statistics
  const calculateHeaderStats = () => {
    const totalMembers = filteredMembers.length;
    const totalCapacity = filteredMembers.reduce((sum, member) => 
      sum + ((member.weekly_capacity || 40) * periodToShow), 0
    );
    
    let totalAllocated = 0;
    filteredMembers.forEach(member => {
      const memberData = workloadData[member.id] || {};
      const memberTotal = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
      totalAllocated += memberTotal;
    });
    
    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    
    return {
      totalMembers,
      totalCapacity,
      utilizationRate,
      timeRange: `${periodToShow} weeks`
    };
  };

  const headerStats = calculateHeaderStats();

  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Team Workload</h1>
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

      <TeamWorkloadHeader
        totalMembers={headerStats.totalMembers}
        totalCapacity={headerStats.totalCapacity}
        timeRange={headerStats.timeRange}
        utilizationRate={headerStats.utilizationRate}
      />
      
      {/* Enhanced Summary Section */}
      {!isLoading && !isLoadingWorkload && (
        <WorkloadSummary 
          members={filteredMembers}
          workloadData={workloadData}
          selectedWeek={selectedWeek}
          periodToShow={periodToShow}
          summaryFormat={summaryFormat}
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
          <WorkloadCalendar 
            members={filteredMembers}
            selectedWeek={selectedWeek}
            workloadData={workloadData}
            periodToShow={periodToShow}
          />
        )}
      </div>
    </div>
  );
};
