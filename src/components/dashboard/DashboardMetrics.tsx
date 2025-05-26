
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { DashboardHeader } from './DashboardHeader';
import { DashboardLoadingState } from './DashboardLoadingState';
import { useDashboardData } from './hooks/useDashboardData';

export const DashboardMetrics = () => {
  const isMobile = useIsMobile();
  const {
    selectedOffice,
    setSelectedOffice,
    selectedTimeRange,
    setSelectedTimeRange,
    allTeamMembers,
    utilizationTrends,
    metrics,
    staffData,
    officeOptions,
    mockData,
    isLoading
  } = useDashboardData();

  // Show loading state with skeleton
  if (isLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
        officeOptions={officeOptions}
      />

      {/* Main Content */}
      <div className="pb-6">
        {isMobile ? (
          <MobileDashboard
            teamMembers={allTeamMembers}
            activeProjects={metrics.activeProjects}
            activeResources={metrics.activeResources}
            utilizationTrends={utilizationTrends}
            staffData={staffData}
            mockData={mockData}
          />
        ) : (
          <div className="p-4">
            <DesktopDashboard
              teamMembers={allTeamMembers}
              activeProjects={metrics.activeProjects}
              activeResources={metrics.activeResources}
              utilizationTrends={utilizationTrends}
              staffData={staffData}
              mockData={mockData}
            />
          </div>
        )}
      </div>
    </div>
  );
};
