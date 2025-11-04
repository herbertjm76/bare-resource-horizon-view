
import { useState, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { useTimeRangeMetrics } from './useTimeRangeMetrics';
import { useHolidays } from './useHolidays';
import { useTeamData } from './useTeamData';
import { useProjectData } from './useProjectData';
import { getUtilizationStatus, generateUtilizationTrends } from './utils/utilizationCalculations';
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
    teamMembers: originalTeamMembers, 
    preRegisteredMembers, 
    isLoading: isTeamLoading, 
    refetch: refetchTeam 
  } = useTeamData(company?.id);
  
  const { 
    projects, 
    isLoading: isProjectsLoading, 
    refetch: refetchProjects 
  } = useProjectData(company?.id);

  const { 
    teamComposition, 
    isLoading: isTeamCompositionLoading 
  } = useTeamCompositionData(company?.id);

  const teamMembers = originalTeamMembers;

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
      case '4months':
        startDate = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
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

  console.log('🔄 DASHBOARD DATA FLOW:', {
    originalTeamMembers: originalTeamMembers.length,
    preRegisteredMembers: preRegisteredMembers.length,
    combinedTeamMembers: combinedTeamMembers.length,
    transformedStaffData: transformedStaffData.length,
    memberUtilizations: memberUtilizations.length,
    currentUtilizationRate,
    teamNames: combinedTeamMembers.map(m => 
      'first_name' in m ? `${m.first_name} ${m.last_name}` : m.name || 'Unknown'
    )
  });

  const officeOptions = ['All Offices'];
  
  const isLoading = isTeamLoading || isProjectsLoading;

  const refetch = async () => {
    await Promise.all([
      refetchTeam(), 
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
    console.log('🔍 PAUL JULIUS DATA CONSISTENCY CHECK:', {
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
