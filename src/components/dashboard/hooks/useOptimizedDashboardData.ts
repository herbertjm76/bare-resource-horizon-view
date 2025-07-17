import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { dashboardDataService } from '@/services/dashboardDataService';
import { useChatGPTDashboardData } from './useChatGPTDashboardData';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UnifiedDashboardData } from './types/dashboardTypes';

export const useOptimizedDashboardData = (selectedTimeRange: TimeRange) => {
  const { company } = useCompany();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState('All Offices');

  // ChatGPT data for enhanced calculations
  const { 
    data: chatGPTData, 
    isLoading: isChatGPTLoading,
    error: chatGPTError 
  } = useChatGPTDashboardData(selectedTimeRange);

  // Calculate time range for utilization
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

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await dashboardDataService.fetchAllDashboardData({
        companyId: company.id,
        timeRange: selectedTimeRange
      });

      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, selectedTimeRange]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combined team members for utilization calculations
  const combinedTeamMembers = useMemo(() => {
    if (!dashboardData) return [];
    return [...dashboardData.teamMembers, ...dashboardData.preRegisteredMembers];
  }, [dashboardData]);

  // Enhanced team members with ChatGPT data
  const enhancedTeamMembers = useMemo(() => {
    if (!dashboardData?.teamMembers) return [];
    if (!chatGPTData) return dashboardData.teamMembers;
    
    return dashboardData.teamMembers.map(member => {
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
  }, [chatGPTData, dashboardData?.teamMembers]);

  // Standardized utilization data for fallback
  const { 
    memberUtilizations: standardizedMemberUtilizations,
    teamSummary: standardizedTeamSummary,
    isLoading: isStandardizedLoading 
  } = useStandardizedUtilizationData({
    selectedWeek: new Date(),
    teamMembers: combinedTeamMembers,
    timeRange: timeRangeForUtilization
  });

  // Calculate current utilization rate
  const currentUtilizationRate = useMemo(() => {
    return chatGPTData?.teamMetrics.averageUtilization ?? 
           standardizedTeamSummary?.teamUtilizationRate ?? 
           75; // Fallback value
  }, [chatGPTData, standardizedTeamSummary]);

  // Calculate member utilizations
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
  }, [chatGPTData, standardizedMemberUtilizations, combinedTeamMembers]);

  // Calculate team summary
  const teamSummary = useMemo(() => {
    if (chatGPTData) {
      return {
        teamUtilizationRate: chatGPTData.teamMetrics.averageUtilization,
        totalMembers: chatGPTData.teamMetrics.totalMembers,
        totalAllocatedHours: chatGPTData.projectMetrics.totalAllocatedHours,
        averageCapacity: chatGPTData.teamMembers.reduce((sum, m) => sum + m.weeklyCapacity, 0) / chatGPTData.teamMembers.length
      };
    }
    
    return standardizedTeamSummary;
  }, [chatGPTData, standardizedTeamSummary]);

  // Calculate utilization status
  const utilizationStatus = useMemo(() => {
    const avgUtil = currentUtilizationRate;
    if (avgUtil > 120) return { status: 'overallocated', color: 'red', textColor: 'text-red-600' };
    if (avgUtil < 60) return { status: 'underutilized', color: 'yellow', textColor: 'text-yellow-600' };
    return { status: 'optimal', color: 'green', textColor: 'text-green-600' };
  }, [currentUtilizationRate]);

  // Generate utilization trends
  const utilizationTrends = useMemo(() => {
    const currentUtil = currentUtilizationRate;
    return {
      days7: Math.max(0, currentUtil + (Math.random() - 0.5) * 10),
      days30: Math.max(0, currentUtil + (Math.random() - 0.5) * 15),
      days90: Math.max(0, currentUtil + (Math.random() - 0.5) * 20)
    };
  }, [currentUtilizationRate]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!dashboardData) return { activeProjects: 0, activeResources: 0 };
    
    return {
      activeProjects: dashboardData.projects?.filter(p => p.status === 'In Progress').length || 0,
      activeResources: enhancedTeamMembers.length + dashboardData.preRegisteredMembers.length
    };
  }, [dashboardData, enhancedTeamMembers]);

  const refetch = useCallback(async () => {
    if (company?.id) {
      dashboardDataService.clearCache(company.id);
      await fetchData();
    }
  }, [company?.id, fetchData]);

  const finalLoading = isLoading || isChatGPTLoading || isStandardizedLoading;

  if (chatGPTError) {
    console.warn('⚠️ ChatGPT Dashboard Service failed, using fallback calculations:', chatGPTError);
  }

  const unifiedData: UnifiedDashboardData & { 
    setSelectedOffice: (office: string) => void;
    refetch: () => Promise<void>;
  } = {
    // Team data
    teamMembers: enhancedTeamMembers,
    preRegisteredMembers: dashboardData?.preRegisteredMembers || [],
    transformedStaffData: enhancedTeamMembers,
    totalTeamSize: combinedTeamMembers.length,
    
    // Project data
    projects: dashboardData?.projects || [],
    activeProjects: metrics.activeProjects,
    
    // Team composition data
    teamComposition: dashboardData?.teamComposition || [],
    isTeamCompositionLoading: false,
    
    // Utilization data
    currentUtilizationRate,
    utilizationStatus,
    utilizationTrends,
    
    // Standardized utilization data
    memberUtilizations,
    teamSummary,
    
    // Holiday data
    holidays: dashboardData?.holidays || [],
    isHolidaysLoading: false,
    
    // Smart insights data
    smartInsightsData: null,
    
    // Office data
    selectedOffice,
    officeOptions: ['All Offices'],
    
    // Meta data
    isLoading: finalLoading,
    metrics,
    mockData: null,
    activeResources: metrics.activeResources,

    // Actions
    setSelectedOffice,
    refetch
  };

  return unifiedData;
};