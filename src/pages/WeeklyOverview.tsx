
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { startOfWeek, format } from 'date-fns';
import { Toaster } from 'sonner';
import { Calendar } from 'lucide-react';

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
      <div className="space-y-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
              <Calendar className="h-8 w-8 text-brand-violet" />
              Weekly Overview
            </h1>
            <p className="text-muted-foreground">
              View and manage weekly resource allocations for your team
            </p>
          </div>
        </div>
      </div>

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
