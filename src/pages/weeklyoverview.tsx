
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { WeeklyOverviewHeader } from '@/components/weekly-overview/WeeklyOverviewHeader';
import { startOfWeek, format } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { Toaster } from 'sonner';

const HEADER_HEIGHT = 56;

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
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row bg-gray-50">
        <div className="flex-shrink-0 print:hidden">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="print:hidden">
            <AppHeader />
          </div>
          <div style={{
            height: HEADER_HEIGHT
          }} className="print:hidden" />
          <div className="flex-1 p-3 sm:p-4 lg:p-6 bg-gray-50 min-w-0">
            <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
              <WeeklyOverviewHeader selectedWeek={selectedWeek} />
              
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
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
};

export default WeeklyOverview;
