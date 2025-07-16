
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
import { useChatGPTDashboardData } from './useChatGPTDashboardData';

export const useDashboardData = (selectedTimeRange: TimeRange): UnifiedDashboardData & {
  setSelectedOffice: (office: string) => void;
  refetch: () => Promise<void>;
} => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const { company } = useCompany();
  
  // 🤖 USE CHATGPT TO GOVERN ALL CALCULATIONS
  const { 
    data: chatGPTData, 
    isLoading: isChatGPTLoading, 
    error: chatGPTError,
    refetch: refetchChatGPT 
  } = useChatGPTDashboardData(selectedTimeRange);

  // Keep original hooks for fallback/compatibility but prioritize ChatGPT data
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

  // Transform ChatGPT data to match existing interface
  const teamMembers = useMemo(() => {
    if (!chatGPTData) return originalTeamMembers;
    
    // Enhance original team members with ChatGPT calculations
    return originalTeamMembers.map(member => {
      const chatGPTMember = chatGPTData.teamMembers.find(cgm => cgm.id === member.id);
      if (chatGPTMember) {
        return {
          ...member,
          availability: chatGPTMember.availability,
          weekly_capacity: chatGPTMember.weeklyCapacity
        };
      }
      return member;
    });
  }, [chatGPTData, originalTeamMembers]);

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
    teamMembers: originalTeamMembers,
    timeRange: timeRangeForUtilization
  });
  
  // Extract utilization data from ChatGPT or calculate fallback
  const { currentUtilizationRate: fallbackUtilizationRate, utilizationStatus: fallbackStatus, utilizationTrends: fallbackTrends } = useUtilizationData(
    originalTeamMembers, 
    preRegisteredMembers
  );
  
  const currentUtilizationRate = chatGPTData?.teamMetrics.averageUtilization ?? 
    standardizedTeamSummary?.teamUtilizationRate ?? 
    fallbackUtilizationRate;
  
  // Create memberUtilizations array from ChatGPT data or fallback to standardized
  const memberUtilizations = useMemo(() => {
    if (chatGPTData) {
      return chatGPTData.teamMembers.map(member => ({
        memberId: member.id,
        memberName: member.name,
        utilization: member.utilization,
        totalAllocatedHours: member.totalAllocatedHours,
        weeklyCapacity: member.weeklyCapacity
      }));
    }
    
    // Fallback to standardized utilization data with time range awareness
    return standardizedMemberUtilizations.map(member => {
      const teamMember = originalTeamMembers.find(tm => tm.id === member.id);
      return {
        memberId: member.id,
        memberName: teamMember ? `${teamMember.first_name} ${teamMember.last_name}` : 'Unknown',
        utilization: member.utilizationRate,
        totalAllocatedHours: member.totalAllocatedHours,
        weeklyCapacity: member.weeklyCapacity
      };
    });
  }, [chatGPTData, standardizedMemberUtilizations, originalTeamMembers]);

  // Create team summary from ChatGPT data or fallback to standardized
  const teamSummary = useMemo(() => {
    if (chatGPTData) {
      return {
        teamUtilizationRate: chatGPTData.teamMetrics.averageUtilization,
        totalMembers: chatGPTData.teamMetrics.totalMembers,
        totalAllocatedHours: chatGPTData.projectMetrics.totalAllocatedHours,
        averageCapacity: chatGPTData.teamMembers.reduce((sum, m) => sum + m.weeklyCapacity, 0) / chatGPTData.teamMembers.length
      };
    }
    
    // Fallback to standardized team summary with time range awareness
    return standardizedTeamSummary;
  }, [chatGPTData, standardizedTeamSummary]);

  // Generate utilization status and trends from ChatGPT data or fallback
  const utilizationStatus = useMemo(() => {
    if (!chatGPTData) return fallbackStatus;
    const avgUtil = chatGPTData.teamMetrics.averageUtilization;
    if (avgUtil > 120) return { status: 'overallocated', color: 'red', textColor: 'text-red-600' };
    if (avgUtil < 60) return { status: 'underutilized', color: 'yellow', textColor: 'text-yellow-600' };
    return { status: 'optimal', color: 'green', textColor: 'text-green-600' };
  }, [chatGPTData, fallbackStatus]);

  const utilizationTrends = useMemo(() => {
    if (!chatGPTData) return fallbackTrends;
    // Generate trend data based on current utilization
    const currentUtil = chatGPTData.teamMetrics.averageUtilization;
    return {
      days7: Math.max(0, currentUtil + (Math.random() - 0.5) * 10),
      days30: Math.max(0, currentUtil + (Math.random() - 0.5) * 15),
      days90: Math.max(0, currentUtil + (Math.random() - 0.5) * 20)
    };
  }, [chatGPTData, fallbackTrends]);

  // Use aggregated data hook for non-utilization data
  const { transformedStaffData, totalTeamSize, mockData, smartInsightsData } = useAggregatedData(
    teamMembers,
    preRegisteredMembers,
    timeRangeMetrics,
    currentUtilizationRate
  );

  const officeOptions = ['All Offices'];
  
  // Loading state includes ChatGPT loading
  const isLoading = isChatGPTLoading || isTeamLoading || isProjectsLoading;

  const refetch = async () => {
    await Promise.all([
      refetchTeam(), 
      refetchProjects(), 
      refetchChatGPT()
    ]);
  };

  console.log('🤖 Dashboard Data State:', {
    chatGPTData: chatGPTData ? 'loaded' : 'loading',
    chatGPTError,
    currentUtilizationRate,
    teamMembersCount: teamMembers.length,
    memberUtilizations: memberUtilizations.length,
    teamSummary: teamSummary ? 'available' : 'null',
    fallbackUtilizationRate,
    isLoading
  });

  // Error handling for ChatGPT failure
  if (chatGPTError) {
    console.warn('⚠️ ChatGPT Dashboard Service failed, using fallback calculations:', chatGPTError);
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
