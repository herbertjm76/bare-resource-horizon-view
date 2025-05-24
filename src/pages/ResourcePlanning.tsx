
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { ResourcePlanningContent } from '@/components/resource-planning/ResourcePlanningContent';
import { startOfMonth } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { Toaster } from 'sonner';

const HEADER_HEIGHT = 56;

const ResourcePlanning = () => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    periodToShow: 12
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMonthChange = (month: Date) => {
    setSelectedMonth(startOfMonth(month));
  };

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
            <OfficeSettingsProvider>
              <ResourcePlanningContent
                selectedMonth={selectedMonth}
                searchTerm={searchTerm}
                filters={filters}
                onMonthChange={handleMonthChange}
                onSearchChange={setSearchTerm}
                onFilterChange={handleFilterChange}
              />
            </OfficeSettingsProvider>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
};

export default ResourcePlanning;
