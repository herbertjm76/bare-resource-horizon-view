
import { useState, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { useTimeRangeMetrics } from './useTimeRangeMetrics';
import { useHolidays } from './useHolidays';
import { useTeamData } from './useTeamData';
import { useProjectData } from './useProjectData';
import { useUtilizationData } from './useUtilizationData';
import { useTeamCompositionData } from './useTeamCompositionData';
import { useAggregatedData } from './useAggregatedData';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UnifiedDashboardData } from './types/dashboardTypes';

export const useDashboardData = (selectedTimeRange: TimeRange): UnifiedDashboardData & {
  setSelectedOffice: (office: string) => void;
  refetch: () => Promise<void>;
} => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const { company } = useCompany();
  const { metrics: timeRangeMetrics, isLoading: metricsLoading } = useTimeRangeMetrics(selectedTimeRange);
  const { holidays, isLoading: isHolidaysLoading } = useHolidays();
  
  const { 
    teamMembers, 
    preRegisteredMembers, 
    isLoading: isTeamLoading, 
    refetch: refetchTeam 
  } = useTeamData(company?.id);
  
  const { 
    projects, 
    isLoading: isProjectsLoading, 
    refetch: refetchProjects 
  } = useProjectData(company?.id);

  // Use team composition hook
  const { 
    teamComposition, 
    isLoading: isTeamCompositionLoading 
  } = useTeamCompositionData(company?.id);

  // Use extracted utilization hook
  const { currentUtilizationRate, utilizationStatus, utilizationTrends } = useUtilizationData(
    teamMembers, 
    preRegisteredMembers
  );

  // Memoize the current week date to prevent re-renders
  const currentWeek = useMemo(() => new Date(), []);
  
  // Use standardized utilization data for current week only when we have team members
  const { memberUtilizations, teamSummary, isLoading: isStandardizedLoading } = useStandardizedUtilizationData({
    selectedWeek: currentWeek,
    teamMembers: teamMembers || []
  });

  // Use extracted aggregated data hook
  const { transformedStaffData, totalTeamSize, mockData, smartInsightsData } = useAggregatedData(
    teamMembers,
    preRegisteredMembers,
    timeRangeMetrics,
    currentUtilizationRate
  );

  const officeOptions = ['All Offices'];
  // Only show loading when critical data is loading, not optional features
  const isLoading = isTeamLoading || isProjectsLoading || metricsLoading;

  const refetch = async () => {
    await Promise.all([refetchTeam(), refetchProjects()]);
  };

  const unifiedData: UnifiedDashboardData = {
    // Team data
    teamMembers,
    preRegisteredMembers,
    transformedStaffData,
    totalTeamSize,
    
    // Project data
    projects,
    activeProjects: timeRangeMetrics.activeProjects,
    
    // Team composition data
    teamComposition,
    isTeamCompositionLoading,
    
    // Utilization data
    currentUtilizationRate: teamSummary?.teamUtilizationRate || currentUtilizationRate,
    utilizationStatus,
    utilizationTrends,
    
    // Standardized utilization data
    memberUtilizations: memberUtilizations || [],
    teamSummary: teamSummary || null,
    
    // Holiday data
    holidays: holidays || [],
    isHolidaysLoading,
    
    // Smart insights data
    smartInsightsData,
    
    // Office data
    selectedOffice,
    officeOptions,
    
    // Meta data
    isLoading,
    metrics: timeRangeMetrics,
    mockData,
    activeResources: timeRangeMetrics.activeResources
  };

  return {
    ...unifiedData,
    setSelectedOffice,
    refetch
  };
};

// Re-export the types for backward compatibility
export type { UnifiedDashboardData } from './types/dashboardTypes';
