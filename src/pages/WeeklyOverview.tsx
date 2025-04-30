
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { WeeklyResourceTable } from '@/components/weekly-overview/WeeklyResourceTable';
import { WeeklyResourceFilters } from '@/components/weekly-overview/WeeklyResourceFilters';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

const HEADER_HEIGHT = 56;

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    office: "all",
  });

  const handlePreviousWeek = () => {
    setSelectedWeek(prevDate => subWeeks(prevDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(prevDate => addWeeks(prevDate, 1));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get Monday of the current week
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = `Week of ${format(weekStart, 'MMMM d, yyyy')}`;

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <div className="max-w-full mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Weekly Overview</h1>
                <WeekSelector 
                  selectedWeek={selectedWeek}
                  onPreviousWeek={handlePreviousWeek}
                  onNextWeek={handleNextWeek}
                  weekLabel={weekLabel}
                />
              </div>
              
              <WeeklyResourceFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              <OfficeSettingsProvider>
                <WeeklyResourceTable 
                  selectedWeek={selectedWeek} 
                  filters={filters}
                />
              </OfficeSettingsProvider>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WeeklyOverview;
