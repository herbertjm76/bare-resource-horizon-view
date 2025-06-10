
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { startOfWeek, format } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { Toaster } from 'sonner';
import { Calendar } from 'lucide-react';

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
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
      <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
        {/* Standardized Header with icon and title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <Calendar className="h-6 w-6 text-brand-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Weekly Overview
          </h1>
        </div>
        
        <OfficeSettingsProvider>
          <WeekResourceView 
            selectedWeek={selectedWeek}
            setSelectedWeek={setSelectedWeek}
            weekLabel={weekLabel}
            filters={{
              office: filters.office,
              searchTerm: filters.searchTerm
            }}
            onFilterChange={handleFilterChange}
          />
        </OfficeSettingsProvider>
      </div>
      <Toaster position="top-right" />
    </StandardLayout>
  );
};

export default WeeklyOverview;
