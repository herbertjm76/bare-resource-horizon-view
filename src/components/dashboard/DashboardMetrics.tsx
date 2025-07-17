
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDashboard } from './MobileDashboard';
import { DesktopDashboard } from './DesktopDashboard';
import { DashboardHeader } from './DashboardHeader';
import { ModernDashboardHeader } from './ModernDashboardHeader';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { DashboardLoadingState } from './DashboardLoadingState';
import { UnifiedDashboardProvider, useUnifiedDashboardData } from './UnifiedDashboardProvider';
import { useDashboardCache } from './hooks/useDashboardCache';
import { toast } from "sonner";
import { TimeRange } from './TimeRangeSelector';


export const DashboardMetrics = () => {
  const isMobile = useIsMobile();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  const { preloadData } = useDashboardCache();

  // Show toast when time range changes and preload next likely range
  const handleTimeRangeChange = async (newRange: TimeRange) => {
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

    // Preload commonly accessed ranges for better UX
    setTimeout(async () => {
      if (newRange === 'month') {
        await preloadData('week');
      } else if (newRange === 'week') {
        await preloadData('month');
      }
    }, 1000);
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

// Simplified dashboard content component that uses the optimized context
const DashboardContent: React.FC<{
  isMobile: boolean;
  selectedTimeRange: TimeRange;
  handleTimeRangeChange: (newRange: TimeRange) => void;
}> = ({ isMobile, selectedTimeRange, handleTimeRangeChange }) => {
  // Use the optimized data from the provider
  const dashboardData = useUnifiedDashboardData();

  const {
    selectedOffice,
    setSelectedOffice,
    teamMembers,
    activeProjects,
    currentUtilizationRate,
    officeOptions,
    isLoading
  } = dashboardData;

  // Show loading state with skeleton
  if (isLoading) {
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
          utilizationRate={currentUtilizationRate}
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
            selectedTimeRange={selectedTimeRange}
          />
        ) : (
          <div className="px-2 sm:px-3 lg:px-4">
            <DesktopDashboard
              selectedTimeRange={selectedTimeRange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
