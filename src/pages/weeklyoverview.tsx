
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { WeekResourceControls } from '@/components/week-resourcing/WeekResourceControls';
import { WeeklyOverviewHeader } from '@/components/weekly-overview/WeeklyOverviewHeader';
import { startOfWeek, format } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { Toaster } from 'sonner';

const HEADER_HEIGHT = 56;

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [summaryFormat, setSummaryFormat] = useState<'simple' | 'detailed'>('simple');
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
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0 print:hidden">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="print:hidden">
            <AppHeader />
          </div>
          <div style={{
            height: HEADER_HEIGHT
          }} className="print:hidden" />
          <div className="flex-1 p-4 sm:p-6 bg-background">
            <div className="max-w-full mx-auto space-y-4">
              <WeeklyOverviewHeader 
                summaryFormat={summaryFormat}
                setSummaryFormat={setSummaryFormat}
              />
              
              <WeekResourceControls 
                selectedWeek={selectedWeek} 
                setSelectedWeek={setSelectedWeek} 
                weekLabel={weekLabel} 
                filters={filters} 
                onFilterChange={handleFilterChange} 
              />
              
              <OfficeSettingsProvider>
                <WeekResourceView 
                  selectedWeek={selectedWeek} 
                  filters={filters}
                  summaryFormat={summaryFormat}
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
