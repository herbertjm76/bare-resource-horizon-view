
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { WeeklyResourceTable } from '@/components/weekly-overview/WeeklyResourceTable';
import { WeeklyResourceFilters } from '@/components/weekly-overview/WeeklyResourceFilters';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { WeeklyActionButtons } from '@/components/weekly-overview/components/WeeklyActionButtons';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useProjects } from '@/hooks/useProjects';
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
  const [filters, setFilters] = useState({
    office: "all",
  });

  // Get data for summary
  const { teamMembers } = useTeamMembersData(true);
  const { projects } = useProjects();

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

  // Calculate metrics for the weekly overview
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const totalCapacity = teamMembers.reduce((total, member) => total + (member.weekly_capacity || 40), 0);
  const averageUtilization = 75; // This would come from actual allocation data

  const metrics = [
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: "In progress this week",
      badgeText: activeProjects > 5 ? 'High Load' : 'Normal',
      badgeColor: activeProjects > 5 ? 'orange' : 'green'
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      subtitle: "Available resources",
      badgeText: "Full Team",
      badgeColor: "blue"
    },
    {
      title: "Weekly Capacity",
      value: `${totalCapacity}h`,
      subtitle: "Total team hours",
      badgeText: "Available",
      badgeColor: "green"
    },
    {
      title: "Utilization",
      value: `${averageUtilization}%`,
      subtitle: "Average team load",
      badgeText: averageUtilization > 85 ? 'High' : averageUtilization > 65 ? 'Optimal' : 'Low',
      badgeColor: averageUtilization > 85 ? 'red' : averageUtilization > 65 ? 'green' : 'orange'
    }
  ];

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
            <div className="flex-1 p-4 sm:p-6 bg-background">
              {/* Print only title - hidden in normal view */}
              <div className="hidden print:block">
                <h1 className="print-title">Weekly Resource Overview</h1>
                <p className="print-subtitle">{weekLabel}</p>
              </div>
              
              <div className="max-w-full mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 print:hidden">
                  <h1 className="text-2xl font-bold tracking-tight text-brand-primary">Weekly Overview</h1>
                </div>
                
                {/* Executive Summary */}
                <div className="print:hidden">
                  <StandardizedExecutiveSummary
                    metrics={metrics}
                    gradientType="purple"
                  />
                </div>
                
                {/* Control bar with filters */}
                <div className="flex flex-wrap gap-4 mb-4 print:hidden">
                  {/* Week selector */}
                  <div className="flex border rounded-md p-2 items-center">
                    <WeekSelector 
                      selectedWeek={selectedWeek}
                      onPreviousWeek={handlePreviousWeek}
                      onNextWeek={handleNextWeek}
                      weekLabel={weekLabel}
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex-1 max-w-xs border rounded-md p-2">
                    <WeeklyResourceFilters 
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                  
                  {/* Export button */}
                  <div className="flex items-center">
                    <WeeklyActionButtons 
                      selectedWeek={selectedWeek}
                      weekLabel={weekLabel}
                    />
                  </div>
                </div>
                
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
        <Toaster position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default WeeklyOverview;
