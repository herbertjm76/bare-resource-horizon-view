
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { DashboardHeader } from './DashboardHeader';
import { ModernDashboardHeader } from './ModernDashboardHeader';
import { DashboardLoadingState } from './DashboardLoadingState';
import { useDashboardData } from './hooks/useDashboardData';
import { useStandardizedUtilization } from './hooks/useStandardizedUtilization';
import { toast } from "sonner";

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

  // Use standardized utilization calculation
  const { utilizationRate, isLoading: isUtilizationLoading } = useStandardizedUtilization(
    allTeamMembers || [],
    selectedTimeRange
  );

  // Show loading state with skeleton
  if (isLoading || isUtilizationLoading) {
    return <DashboardLoadingState />;
  }

  // Show toast when time range changes
  const handleTimeRangeChange = (newRange: typeof selectedTimeRange) => {
    setSelectedTimeRange(newRange);
    
    const rangeText = {
      'week': 'This Week',
      'month': 'This Month',
      '3months': 'This Quarter',
      '4months': '4 Months',
      '6months': '6 Months',
      'year': 'This Year'
    }[newRange];
    
    toast.success(`Dashboard updated to show data for ${rangeText}`);
  };

  // Calculate stats for the modern header
  const totalTeamMembers = allTeamMembers?.length || 0;
  const totalActiveProjects = metrics.activeProjects || 0;
  const totalOffices = officeOptions?.length || 0;

  // Prepare data for Mobile and Desktop Dashboard components
  const invites: any[] = [];
  const projects = Array.from({ length: metrics.activeProjects }, (_, i) => ({ id: i }));
  
  const executiveSummaryData = {
    teamSize: allTeamMembers.length,
    utilizationRate: utilizationRate,
    totalCapacity: allTeamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <div className="p-4 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
        <ModernDashboardHeader
          totalTeamMembers={totalTeamMembers}
          totalActiveProjects={totalActiveProjects}
          totalOffices={totalOffices}
          utilizationRate={utilizationRate}
        />
      </div>

      {/* Filters Header */}
      <DashboardHeader
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={handleTimeRangeChange}
        officeOptions={officeOptions}
      />

      {/* Main Content */}
      <div className="pb-6">
        {isMobile ? (
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
        ) : (
          <div className="p-4">
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
        )}
      </div>
    </div>
  );
};
