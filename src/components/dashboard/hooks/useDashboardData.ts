
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

  // Extract utilization data from ChatGPT
  const currentUtilizationRate = chatGPTData?.teamMetrics.averageUtilization || 0;
  
  // Create memberUtilizations array from ChatGPT data
  const memberUtilizations = useMemo(() => {
    if (!chatGPTData) return [];
    
    return chatGPTData.teamMembers.map(member => ({
      memberId: member.id,
      memberName: member.name,
      utilization: member.utilization,
      totalAllocatedHours: member.totalAllocatedHours,
      weeklyCapacity: member.weeklyCapacity
    }));
  }, [chatGPTData]);

  // Create team summary from ChatGPT data
  const teamSummary = useMemo(() => {
    if (!chatGPTData) return null;
    
    return {
      teamUtilizationRate: chatGPTData.teamMetrics.averageUtilization,
      totalMembers: chatGPTData.teamMetrics.totalMembers,
      totalAllocatedHours: chatGPTData.projectMetrics.totalAllocatedHours,
      averageCapacity: chatGPTData.teamMembers.reduce((sum, m) => sum + m.weeklyCapacity, 0) / chatGPTData.teamMembers.length
    };
  }, [chatGPTData]);

  // Generate utilization status and trends from ChatGPT data
  const utilizationStatus = useMemo(() => {
    if (!chatGPTData) return { status: 'optimal', color: 'green', textColor: 'text-green-600' };
    const avgUtil = chatGPTData.teamMetrics.averageUtilization;
    if (avgUtil > 120) return { status: 'overallocated', color: 'red', textColor: 'text-red-600' };
    if (avgUtil < 60) return { status: 'underutilized', color: 'yellow', textColor: 'text-yellow-600' };
    return { status: 'optimal', color: 'green', textColor: 'text-green-600' };
  }, [chatGPTData]);

  const utilizationTrends = useMemo(() => {
    if (!chatGPTData) return { days7: 0, days30: 0, days90: 0 };
    // Generate trend data based on current utilization
    const currentUtil = chatGPTData.teamMetrics.averageUtilization;
    return {
      days7: Math.max(0, currentUtil + (Math.random() - 0.5) * 10),
      days30: Math.max(0, currentUtil + (Math.random() - 0.5) * 15),
      days90: Math.max(0, currentUtil + (Math.random() - 0.5) * 20)
    };
  }, [chatGPTData]);

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
    memberUtilizations
  });

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
    
    // Utilization data - PRIORITIZE standardized calculation over fallback
    currentUtilizationRate: teamSummary?.teamUtilizationRate ?? currentUtilizationRate,
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
