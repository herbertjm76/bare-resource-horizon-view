
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NewResourceTable } from './NewResourceTable';
import { WeekResourceControls } from './WeekResourceControls';
import { WeekResourceSummaryCard } from './WeekResourceSummaryCard';
import { useWeekResourceData } from './hooks/useWeekResourceData';
import { useWeekResourceLeaveData } from './hooks/useWeekResourceLeaveData';
import { format } from 'date-fns';

interface WeekResourceViewProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const weekStartDate = format(selectedWeek, 'yyyy-MM-dd');
  
  const {
    members,
    projects,
    allocations,
    isLoading,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave
  } = useWeekResourceData(weekStartDate, filters);

  const memberIds = members.map(member => member.id);
  const { annualLeaveData, holidaysData, isLoading: isLoadingLeave } = useWeekResourceLeaveData({
    weekStartDate,
    memberIds
  });

  if (isLoading || isLoadingLeave) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WeekResourceControls 
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        weekLabel={weekLabel}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      
      <WeekResourceSummaryCard 
        members={members}
        projects={projects}
        allocations={allocations}
        annualLeaveData={annualLeaveData}
        holidaysData={holidaysData}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resource Allocation - {weekLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <NewResourceTable 
            members={members}
            projects={projects}
            allocationMap={allocationMap}
            annualLeaveData={annualLeaveData}
            holidaysData={holidaysData}
            getMemberTotal={getMemberTotal}
            getProjectCount={getProjectCount}
            getWeeklyLeave={getWeeklyLeave}
          />
        </CardContent>
      </Card>
    </div>
  );
};
