
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { WeeklyOverviewContent } from '@/components/weekly-overview/WeeklyOverviewContent';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import '@/components/weekly-overview/weekly-overview-print.css';

const HEADER_HEIGHT = 56;

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const WeeklyOverview = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [summaryFormat, setSummaryFormat] = useState<'simple' | 'detailed'>('simple');
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
  // Get Sunday (end of week)
  const weekEnd = addDays(weekStart, 6);
  // Format the week label
  const weekLabel = `Week of ${format(weekStart, 'MMMM d, yyyy')}`;

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row">
          <div className="flex-shrink-0 print:hidden">
            <DashboardSidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="print:hidden">
              <AppHeader />
            </div>
            <div style={{ height: HEADER_HEIGHT }} className="print:hidden" />
            <WeeklyOverviewContent
              selectedWeek={selectedWeek}
              handlePreviousWeek={handlePreviousWeek}
              handleNextWeek={handleNextWeek}
              weekLabel={weekLabel}
              summaryFormat={summaryFormat}
              setSummaryFormat={setSummaryFormat}
              filters={filters}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <Toaster position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default WeeklyOverview;
