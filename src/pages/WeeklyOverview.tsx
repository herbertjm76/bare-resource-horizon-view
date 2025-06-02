
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { WeeklyOverviewContent } from '@/components/weekly-overview/WeeklyOverviewContent';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [filters, setFilters] = useState({
    office: 'all'
  });

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate week label
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = format(weekStart, 'MMM d, yyyy');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <WeeklyOverviewContent
          selectedWeek={selectedWeek}
          handlePreviousWeek={handlePreviousWeek}
          handleNextWeek={handleNextWeek}
          weekLabel={weekLabel}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </SidebarProvider>
  );
};

export default WeeklyOverview;
