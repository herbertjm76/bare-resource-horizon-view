
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { DashboardHeader } from './DashboardHeader';
import { ModernDashboardHeader } from './ModernDashboardHeader';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { DashboardLoadingState } from './DashboardLoadingState';
import { UnifiedDashboardProvider } from './UnifiedDashboardProvider';
import { useDashboardData } from './hooks/useDashboardData';
import { useStandardizedUtilization } from './hooks/useStandardizedUtilization';
import { toast } from "sonner";
import { TimeRange } from './TimeRangeSelector';


export const DashboardMetrics = () => {
  const isMobile = useIsMobile();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');

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

  return (
    <UnifiedDashboardProvider selectedTimeRange={selectedTimeRange}>
      <DashboardContent 
        isMobile={isMobile}
        selectedTimeRange={selectedTimeRange}
        handleTimeRangeChange={handleTimeRangeChange}
      />
    </UnifiedDashboardProvider>
  );
};

// Separate component to access the unified data context
const DashboardContent: React.FC<{
  isMobile: boolean;
  selectedTimeRange: TimeRange;
  handleTimeRangeChange: (newRange: TimeRange) => void;
}> = ({ isMobile, selectedTimeRange, handleTimeRangeChange }) => {
  const dashboardData = useDashboardData(selectedTimeRange);
  const {
    selectedOffice,
    setSelectedOffice,
    teamMembers,
    transformedStaffData,
    utilizationTrends,
    metrics,
    officeOptions,
    mockData,
    isLoading,
    activeProjects,
    currentUtilizationRate
  } = dashboardData;

  // Use standardized utilization calculation
  const { utilizationRate, isLoading: isUtilizationLoading } = useStandardizedUtilization(
    teamMembers || [],
    selectedTimeRange
  );

  // Show loading state with skeleton
  if (isLoading || isUtilizationLoading) {
    return <DashboardLoadingState />;
  }

  // Calculate stats for the modern header
  const totalTeamMembers = teamMembers?.length || 0;
  const totalActiveProjects = activeProjects || 0;
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


      {/* Filters Header - now positioned after Executive Summary */}
      <DashboardHeader
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={handleTimeRangeChange}
        officeOptions={officeOptions}
      />

      {/* Main Content with optimized padding */}
      <div className="pb-4 lg:pb-6">
        {isMobile ? (
          <MobileDashboard
            teamMembers={teamMembers}
            activeProjects={activeProjects}
            activeResources={metrics.activeResources}
            utilizationTrends={utilizationTrends}
            staffData={transformedStaffData}
            mockData={mockData}
            selectedTimeRange={selectedTimeRange}
            standardizedUtilizationRate={utilizationRate}
          />
        ) : (
          <div className="px-2 sm:px-3 lg:px-4">
            <DesktopDashboard
              teamMembers={teamMembers}
              activeProjects={activeProjects}
              activeResources={metrics.activeResources}
              utilizationTrends={utilizationTrends}
              staffData={transformedStaffData}
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
