import { useState, useMemo } from 'react';
import { useCompanyId } from '@/hooks/useCompanyId';
import { TimeRange } from '../TimeRangeSelector';
import { getUtilizationStatus, generateUtilizationTrends } from './utils/utilizationCalculations';
import { useAggregatedData } from './useAggregatedData';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UnifiedDashboardData } from './types/dashboardTypes';
import { 
  useDashboardTeamMembers, 
  useDashboardPreRegistered, 
  useDashboardProjects, 
  useDashboardTeamComposition, 
  useDashboardHolidays,
  useDashboardMetrics 
} from '@/hooks/queries/useDashboardQueries';
import { logger } from '@/utils/logger';

export const useDashboardData = (selectedTimeRange: TimeRange): UnifiedDashboardData & {
  setSelectedOffice: (office: string) => void;
  refetch: () => Promise<void>;
} => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const { companyId, isLoading: companyLoading } = useCompanyId();

  // Single source of truth: React Query hooks
  // companyId from useCompanyId is only defined when ready, so queries won't run prematurely
  const { data: teamMembers = [], isLoading: isTeamLoading, refetch: refetchTeam } = useDashboardTeamMembers(companyId);
  const { data: preRegisteredMembers = [], refetch: refetchPreReg } = useDashboardPreRegistered(companyId);
  const { data: projects = [], isLoading: isProjectsLoading, refetch: refetchProjects } = useDashboardProjects(companyId);
  const { data: teamComposition = [], isLoading: isTeamCompositionLoading } = useDashboardTeamComposition(companyId);
  const { data: holidays = [], isLoading: isHolidaysLoading } = useDashboardHolidays(companyId);
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(companyId, selectedTimeRange);
  
  const timeRangeMetrics = metrics || {
    activeProjects: 0,
    activeResources: 0,
    utilizationTrends: { days7: 0, days30: 0, days90: 0 },
    projectsByStatus: [],
    projectsByStage: [],
    projectsByLocation: [],
    projectsByPM: [],
    totalRevenue: 0,
    avgProjectValue: 0
  };

  // Combine active and pending members for utilization calculations
  const combinedTeamMembers = useMemo(() => {
    return [...teamMembers, ...preRegisteredMembers];
  }, [teamMembers, preRegisteredMembers]);

  // Calculate date range for time-range-aware utilization
  const timeRangeForUtilization = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedTimeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return { startDate, endDate: now };
  }, [selectedTimeRange]);

  // Get time-range-aware standardized utilization data for fallback
  const { 
    memberUtilizations: standardizedMemberUtilizations,
    teamSummary: standardizedTeamSummary,
    isLoading: isStandardizedLoading 
  } = useStandardizedUtilizationData({
    selectedWeek: new Date(),
    teamMembers: combinedTeamMembers, // Use combined team (active + pending)
    timeRange: timeRangeForUtilization
  });
  
  // Extract utilization data from ChatGPT or calculate fallback
  const standardizedCurrentUtilization = standardizedTeamSummary?.teamUtilizationRate ?? 0;
  
  const currentUtilizationRate = standardizedCurrentUtilization;
  
  // Create member utilizations from standardized utilization data
  const memberUtilizations = useMemo(() => {
    return standardizedMemberUtilizations.map(member => {
      const teamMember = combinedTeamMembers.find(tm => tm.id === member.id);
      return {
        memberId: member.id,
        memberName: teamMember ? `${teamMember.first_name} ${teamMember.last_name}` : 'Unknown',
        utilization: member.utilizationRate,
        totalAllocatedHours: member.totalAllocatedHours,
        weeklyCapacity: member.weeklyCapacity
      };
    });
  }, [standardizedMemberUtilizations, combinedTeamMembers]);

  const teamSummary = useMemo(() => standardizedTeamSummary, [standardizedTeamSummary]);

  const utilizationStatus = useMemo(() => getUtilizationStatus(currentUtilizationRate), [currentUtilizationRate]);

  const utilizationTrends = useMemo(() => generateUtilizationTrends(currentUtilizationRate), [currentUtilizationRate]);

  // Use aggregated data hook for non-utilization data - now with real utilization data
  const { transformedStaffData, totalTeamSize, mockData, smartInsightsData } = useAggregatedData(
    teamMembers,
    preRegisteredMembers,
    timeRangeMetrics,
    currentUtilizationRate,
    memberUtilizations // Pass real utilization data
  );

  logger.debug('🔄 DASHBOARD DATA FLOW:', {
    teamMembers: teamMembers.length,
    preRegisteredMembers: preRegisteredMembers.length,
    combinedTeamMembers: combinedTeamMembers.length,
    transformedStaffData: transformedStaffData.length,
    memberUtilizations: memberUtilizations.length,
    currentUtilizationRate,
    teamNames: combinedTeamMembers.map(m => 
      `${m.first_name} ${m.last_name}`
    )
  });

  const officeOptions = ['All Offices'];
  
  // Single consolidated loading state - include company loading
  const isLoading = companyLoading || isTeamLoading || isProjectsLoading || metricsLoading;

  const refetch = async () => {
    await Promise.all([
      refetchTeam(), 
      refetchPreReg(),
      refetchProjects()
    ]);
  };

  // Debug Paul Julius data consistency across all sources
  const paulMemberUtilization = memberUtilizations.find(m => 
    m.memberName?.includes('Paul') || m.memberName?.includes('Julius')
  );
  const paulTransformedStaff = transformedStaffData.find(m => 
    m.name?.includes('Paul') || m.first_name?.includes('Paul')
  );
  
  if (paulMemberUtilization || paulTransformedStaff) {
    logger.debug('🔍 PAUL JULIUS DATA CONSISTENCY CHECK:', {
      timeRange: selectedTimeRange,
      memberUtilizations_Paul: paulMemberUtilization,
      transformedStaffData_Paul: paulTransformedStaff,
      shouldMatch: 'Both should show same utilization/availability for Paul Julius'
    });
  }

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
    
    // Utilization data - Use ChatGPT data if available, otherwise fallback
    currentUtilizationRate: teamSummary?.teamUtilizationRate ?? currentUtilizationRate,
    utilizationStatus,
    utilizationTrends,
    
    // Standardized utilization data - Use either ChatGPT or time-range-aware fallback
    memberUtilizations,
    teamSummary,
    
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
