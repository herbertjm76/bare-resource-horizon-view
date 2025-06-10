
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NewResourceTable } from './NewResourceTable';
import { WeekResourceControls } from './WeekResourceControls';
import { WeekResourceSummaryCard } from './WeekResourceSummaryCard';
import { useWeekResourceData } from './hooks/useWeekResourceData';
import { format, startOfWeek } from 'date-fns';

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
  // Safely format the week start date
  let weekStartDate: string;
  try {
    const monday = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    weekStartDate = format(monday, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback to current week if date is invalid
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    weekStartDate = format(monday, 'yyyy-MM-dd');
  }
  
  const {
    members,
    projects,
    allocations,
    isLoading,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData
  } = useWeekResourceData(weekStartDate, filters);

  if (isLoading) {
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
        weekStartDate={weekStartDate}
        selectedWeek={selectedWeek}
      />
      
      {/* Simplified single container for the table */}
      <Card className="overflow-hidden">
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
      </Card>
    </div>
  );
};
