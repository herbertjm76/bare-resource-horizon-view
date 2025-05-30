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
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
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
  const completedProjects = projects.filter(p => p.status === 'Complete').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  const totalCapacity = teamMembers.reduce((total, member) => total + (member.weekly_capacity || 40), 0);
  const averageUtilization = 75; // This would come from actual allocation data
  const highRiskProjects = Math.round(projects.length * 0.33); // Example calculation

  const metrics = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: TrendingUp,
      breakdowns: [
        { label: "Active", value: activeProjects, color: "green" },
        { label: "Planning", value: planningProjects, color: "orange" }
      ]
    },
    {
      title: "Avg Target Profit",
      value: `${averageUtilization}%`,
      icon: Clock,
      breakdowns: [
        { label: "Completed", value: completedProjects, color: "green" },
        { label: "On Hold", value: projects.filter(p => p.status === 'On Hold').length, color: "orange" }
      ]
    },
    {
      title: "Countries",
      value: 2,
      icon: Users,
      breakdowns: [
        { label: "Vietnam", value: 2, color: "blue" },
        { label: "United Kingdom", value: 1, color: "green" }
      ]
    },
    {
      title: "Offices",
      value: 2,
      icon: AlertTriangle,
      breakdowns: [
        { label: "Risk Level", value: "High risk projects", color: "red" }
      ],
      badgeText: `${highRiskProjects}%`,
      badgeColor: "red"
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
                    useDetailedFormat={true}
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
