
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { DesktopDashboard } from '@/components/dashboard/DesktopDashboard';
import { MobileDashboard } from '@/components/dashboard/MobileDashboard';
import { useCompany } from '@/context/CompanyContext';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { TeamMember } from '@/components/dashboard/types';

const HEADER_HEIGHT = 56;

export const DashboardLayout = () => {
  const { company } = useCompany();
  const { 
    allTeamMembers,
    selectedOffice,
    setSelectedOffice,
    selectedTimeRange,
    setSelectedTimeRange,
    officeOptions,
    metrics,
    isLoading 
  } = useDashboardData();

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  // Mock data for invites and projects since they're not in the hook yet
  const invites: any[] = [];
  const projects = Array.from({ length: metrics.activeProjects }, (_, i) => ({ id: i }));
  
  // Create executive summary data from available metrics
  const executiveSummaryData = {
    teamSize: allTeamMembers.length,
    utilizationRate: 75, // Default value, should come from standardized utilization
    totalCapacity: allTeamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0)
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
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <DesktopDashboard 
                teamMembers={allTeamMembers}
                invites={invites}
                projects={projects}
                executiveSummaryData={executiveSummaryData}
                selectedOffice={selectedOffice}
                setSelectedOffice={setSelectedOffice}
                selectedTimeRange={selectedTimeRange}
                setSelectedTimeRange={setSelectedTimeRange}
                officeOptions={officeOptions}
              />
            </div>
            
            {/* Mobile Layout */}
            <div className="lg:hidden">
              <MobileDashboard 
                teamMembers={allTeamMembers}
                invites={invites}
                projects={projects}
                executiveSummaryData={executiveSummaryData}
                selectedOffice={selectedOffice}
                setSelectedOffice={setSelectedOffice}
                selectedTimeRange={selectedTimeRange}
                setSelectedTimeRange={setSelectedTimeRange}
                officeOptions={officeOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
