import React, { useState } from 'react';
import { PersonResourceGrid } from './PersonResourceGrid';
import { usePersonResourceData } from '@/hooks/usePersonResourceData';
import { useGridDays } from '../hooks/useGridDays';
import { GridLoadingState } from '../grid/GridLoadingState';
import { GridEmptyState } from '../grid/GridEmptyState';

interface PersonResourceViewProps {
  startDate: Date;
  periodToShow: number;
  displayOptions: any;
}

export const PersonResourceView: React.FC<PersonResourceViewProps> = ({
  startDate,
  periodToShow,
  displayOptions
}) => {
  const { personData, isLoading } = usePersonResourceData(startDate, periodToShow);
  const days = useGridDays(startDate, periodToShow, displayOptions);
  const [expandedPeople, setExpandedPeople] = useState<string[]>([]);

  const handleTogglePersonExpand = (personId: string) => {
    setExpandedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  if (isLoading) {
    return <GridLoadingState />;
  }

  if (!personData?.length) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No team members found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Resource Scheduling by Person</h3>
          <p className="text-sm text-gray-600 mt-1">
            Team members with their project allocations
          </p>
        </div>
        
        <div className="p-4">
          <PersonResourceGrid
            personData={personData}
            days={days}
            expandedPeople={expandedPeople}
            onTogglePersonExpand={handleTogglePersonExpand}
            selectedDate={startDate}
            periodToShow={periodToShow}
          />
        </div>
      </div>
    </div>
  );
};
