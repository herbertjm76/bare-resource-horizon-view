
import React from 'react';
import { ResourceTableLoadingState } from '@/components/weekly-overview/components/ResourceTableLoadingState';
import { ResourceTableErrorState } from '@/components/weekly-overview/components/ResourceTableErrorState';
import { EmptyResourceState } from '@/components/weekly-overview/components/EmptyResourceState';
import { ResourceTable } from '@/components/week-resourcing/ResourceTable';
import { NewResourceTable } from '@/components/week-resourcing/NewResourceTable';
import { useWeekResourceData } from './hooks/useWeekResourceData';
import './week-resourcing.css';

interface WeekResourceViewProps {
  selectedWeek: Date;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  filters
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

  return (
    <div className="space-y-8">
      {/* Original Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Resource Table</h3>
        <ResourceTable 
          projects={projects}
          members={members}
          allocations={weekAllocations}
          weekStartDate={weekStartDate}
        />
      </div>
      
      {/* New Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">New Resource Table (Clean Start)</h3>
        <NewResourceTable 
          projects={projects}
          members={members}
          allocations={weekAllocations}
          weekStartDate={weekStartDate}
        />
      </div>
    </div>
  );
};
