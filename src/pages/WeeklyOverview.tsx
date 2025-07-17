
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { startOfWeek, format } from 'date-fns';
import { Toaster } from 'sonner';

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [filters, setFilters] = useState({
    office: "all",
    searchTerm: ""
  });

  // Get Monday of the selected week
  const weekStart = startOfWeek(selectedWeek, {
    weekStartsOn: 1
  });

  // Format the week label for display
  const weekLabel = `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWeekChange = (newWeek: Date) => {
    setSelectedWeek(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };
  
  return (
    <StandardLayout>
      <WeekResourceView
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        onWeekChange={handleWeekChange}
        weekLabel={weekLabel}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Toaster position="top-right" />
    </StandardLayout>
  );
};

export default WeeklyOverview;
