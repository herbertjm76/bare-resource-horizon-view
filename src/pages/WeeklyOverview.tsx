
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { startOfWeek, format } from 'date-fns';
import { Toaster } from 'sonner';
import { Calendar } from 'lucide-react';

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    office: "all",
    searchTerm: ""
  });

  // Get Monday of the current week
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
  
  return (
    <StandardLayout>
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: '#6465F0' }}>
            <Calendar className="h-8 w-8 inline-block mr-3" style={{ color: '#6465F0' }} />
            Weekly Overview
          </h1>
        </div>
        
        <WeekResourceView
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          weekLabel={weekLabel}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <Toaster position="top-right" />
    </StandardLayout>
  );
};

export default WeeklyOverview;
