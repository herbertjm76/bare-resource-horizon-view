
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { DashboardHeader } from './DashboardHeader';
import { ModernDashboardHeader } from './ModernDashboardHeader';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { DashboardLoadingState } from './DashboardLoadingState';
import { useDashboardData } from './hooks/useDashboardData';
import { useStandardizedUtilization } from './hooks/useStandardizedUtilization';
import { toast } from "sonner";
import { TimeRange } from './TimeRangeSelector';

export const DashboardMetrics = () => {
  const isMobile = useIsMobile();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  
  const dashboardData = useDashboardData(selectedTimeRange);
  const {
    selectedOffice,
    setSelectedOffice,
    allTeamMembers,
    utilizationTrends,
    metrics,
    staffData,
    officeOptions,
    mockData,
    isLoading
  } = dashboardData;

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
  const handleTimeRangeChange = (newRange: TimeRange) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      {/* Modern Header with stats - removed padding */}
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
        <ModernDashboardHeader
          totalTeamMembers={totalTeamMembers}
          totalActiveProjects={totalActiveProjects}
          totalOffices={totalOffices}
          utilizationRate={utilizationRate}
        />
      </div>

      {/* Executive Summary - positioned directly after header with no padding */}
      <ExecutiveSummaryCard
        activeProjects={metrics.activeProjects}
        activeResources={metrics.activeResources}
        utilizationTrends={utilizationTrends}
        selectedTimeRange={selectedTimeRange}
        totalRevenue={metrics.totalRevenue}
        avgProjectValue={metrics.avgProjectValue}
        staffData={staffData}
        standardizedUtilizationRate={utilizationRate}
      />

      {/* Filters Header - now positioned after Executive Summary */}
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
            activeProjects={metrics.activeProjects}
            activeResources={metrics.activeResources}
            utilizationTrends={utilizationTrends}
            staffData={staffData}
            mockData={mockData}
            selectedTimeRange={selectedTimeRange}
            standardizedUtilizationRate={utilizationRate}
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
              selectedTimeRange={selectedTimeRange}
              totalRevenue={metrics.totalRevenue}
              avgProjectValue={metrics.avgProjectValue}
              standardizedUtilizationRate={utilizationRate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
