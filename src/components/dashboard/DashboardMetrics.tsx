
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
    mockData,
    isLoading,
    activeProjects,
    currentUtilizationRate
  } = dashboardData;

  // Use ChatGPT-powered utilization data from unified dashboard
  const utilizationRate = currentUtilizationRate;
  const isUtilizationLoading = false; // Already handled in unified loading state

  // Show loading state with skeleton
  if (isLoading || isUtilizationLoading) {
    return <DashboardLoadingState />;
  }

  // Calculate stats for the modern header
  const totalTeamMembers = teamMembers?.length || 0;
  const totalActiveProjects = activeProjects || 0;
  const totalOffices = 1; // Default value since officeOptions is no longer used

  // Create proper office options array
  const officeOptions = [{ value: 'All Offices', label: 'All Offices' }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      {/* Modern Header without metrics */}
      <ModernDashboardHeader
        totalTeamMembers={totalTeamMembers}
        totalActiveProjects={totalActiveProjects}
        totalOffices={totalOffices}
        utilizationRate={utilizationRate}
      />

      {/* Filters Header */}
      <DashboardHeader
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={handleTimeRangeChange}
        officeOptions={officeOptions}
      />

      {/* Main Content */}
      <div className="pb-0">
        {isMobile ? (
          <MobileDashboard
            selectedTimeRange={selectedTimeRange}
          />
        ) : (
          <div className="px-0">
            <DesktopDashboard
              selectedTimeRange={selectedTimeRange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
