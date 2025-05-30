
import React from 'react';
import { ResourceTableLoadingState } from '@/components/weekly-overview/components/ResourceTableLoadingState';
import { ResourceTableErrorState } from '@/components/weekly-overview/components/ResourceTableErrorState';
import { EmptyResourceState } from '@/components/weekly-overview/components/EmptyResourceState';
import { ResourceTable } from '@/components/week-resourcing/ResourceTable';
import { WeekResourceSummary } from '@/components/week-resourcing/WeekResourceSummary';
import { useWeekResourceData } from './hooks/useWeekResourceData';
import './week-resourcing.css';

interface WeekResourceViewProps {
  selectedWeek: Date;
  filters: {
    office: string;
    searchTerm?: string;
  };
  summaryFormat?: 'simple' | 'detailed';
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  filters,
  summaryFormat = 'simple'
}) => {
  const {
    projects,
    members,
    weekAllocations,
    weekStartDate,
    isLoading,
    error
  } = useWeekResourceData({ selectedWeek, filters });
  
  // Render loading state
  if (isLoading) {
    return <ResourceTableLoadingState />;
  }
  
  // Render error state
  if (error) {
    return <ResourceTableErrorState error={error} />;
  }
  
  // Render empty state
  if (!projects || projects.length === 0) {
    return <EmptyResourceState />;
  }

  // Convert weekStartDate string to Date object for WeekResourceSummary
  const weekStartDateAsDate = new Date(weekStartDate);

  return (
    <>
      <WeekResourceSummary 
        projects={projects}
        members={members}
        allocations={weekAllocations}
        weekStartDate={weekStartDateAsDate}
        summaryFormat={summaryFormat}
      />
      
      <ResourceTable 
        projects={projects}
        members={members}
        allocations={weekAllocations}
        weekStartDate={weekStartDate}
      />
    </>
  );
};
