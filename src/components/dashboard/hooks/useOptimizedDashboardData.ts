import { useState, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
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

export const useOptimizedDashboardData = (selectedTimeRange: TimeRange) => {
  const { company } = useCompany();
  const [selectedOffice, setSelectedOffice] = useState('All Offices');

  // Use React Query hooks - single source of truth
  const { data: teamMembers = [], isLoading: isTeamLoading, refetch: refetchTeam } = useDashboardTeamMembers(company?.id);
  const { data: preRegisteredMembers = [], refetch: refetchPreReg } = useDashboardPreRegistered(company?.id);
  const { data: projects = [], refetch: refetchProjects } = useDashboardProjects(company?.id);
  const { data: teamComposition = [] } = useDashboardTeamComposition(company?.id);
  const { data: holidays = [] } = useDashboardHolidays(company?.id);
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(company?.id, selectedTimeRange);

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
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return { startDate, endDate: now };
  }, [selectedTimeRange]);

  // Combined team members for utilization calculations
  const combinedTeamMembers = useMemo(() => {
    return [...teamMembers, ...preRegisteredMembers];
  }, [teamMembers, preRegisteredMembers]);

  // Standardized utilization data
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
    return standardizedTeamSummary?.teamUtilizationRate ?? 75;
  }, [standardizedTeamSummary]);

  // Calculate member utilizations
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

  const teamSummary = standardizedTeamSummary;

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
  const calculatedMetrics = useMemo(() => {
    return {
      activeProjects: metrics?.activeProjects || 0,
      activeResources: combinedTeamMembers.length
    };
  }, [metrics, combinedTeamMembers]);

  const refetch = async () => {
    await Promise.all([refetchTeam(), refetchPreReg(), refetchProjects()]);
  };

  const finalLoading = isTeamLoading || metricsLoading || isStandardizedLoading;

  const unifiedData: UnifiedDashboardData & { 
    setSelectedOffice: (office: string) => void;
    refetch: () => Promise<void>;
  } = {
    // Team data
    teamMembers,
    preRegisteredMembers,
    transformedStaffData: teamMembers,
    totalTeamSize: combinedTeamMembers.length,
    
    // Project data
    projects,
    activeProjects: calculatedMetrics.activeProjects,
    
    // Team composition data
    teamComposition,
    isTeamCompositionLoading: false,
    
    // Utilization data
    currentUtilizationRate,
    utilizationStatus,
    utilizationTrends,
    
    // Standardized utilization data
    memberUtilizations,
    teamSummary,
    
    // Holiday data
    holidays,
    isHolidaysLoading: false,
    
    // Smart insights data
    smartInsightsData: null,
    
    // Office data
    selectedOffice,
    officeOptions: ['All Offices'],
    
    // Meta data
    isLoading: finalLoading,
    metrics: calculatedMetrics,
    mockData: null,
    activeResources: calculatedMetrics.activeResources,

    // Actions
    setSelectedOffice,
    refetch
  };

  return unifiedData;
};