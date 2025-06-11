
import { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { useTimeRangeMetrics } from './useTimeRangeMetrics';
import { useHolidays } from './useHolidays';
import { useTeamData } from './useTeamData';
import { useProjectData } from './useProjectData';
import { UnifiedDashboardData } from './types/dashboardTypes';
import { 
  combineStaffData,
  transformPreRegisteredMembers,
  transformActiveMembers
} from './utils/dataTransformations';
import { 
  calculateUtilizationRate,
  getUtilizationStatus,
  generateUtilizationTrends
} from './utils/utilizationCalculations';
import { 
  createMockData,
  createSmartInsightsData
} from './utils/mockDataUtils';

export const useDashboardData = (selectedTimeRange: TimeRange): UnifiedDashboardData & {
  setSelectedOffice: (office: string) => void;
  refetch: () => Promise<void>;
} => {
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  
  const { company } = useCompany();
  const { metrics: timeRangeMetrics, isLoading: metricsLoading } = useTimeRangeMetrics(selectedTimeRange);
  const { holidays, isLoading: isHolidaysLoading } = useHolidays();
  
  // Use the new modular hooks
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

  // Calculate utilization using utilities
  const currentUtilizationRate = calculateUtilizationRate(teamMembers, preRegisteredMembers);
  const utilizationStatus = getUtilizationStatus(currentUtilizationRate);
  const utilizationTrends = generateUtilizationTrends(currentUtilizationRate);

  // Transform staff data using utilities
  const transformedStaffData = combineStaffData(teamMembers, preRegisteredMembers);
  const totalTeamSize = transformedStaffData.length;

  // Create mock data and insights using utilities
  const mockData = createMockData(timeRangeMetrics);
  const smartInsightsData = createSmartInsightsData(
    transformedStaffData,
    timeRangeMetrics.activeProjects,
    currentUtilizationRate,
    totalTeamSize
  );

  const officeOptions = ['All Offices'];
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
    
    // Utilization data
    currentUtilizationRate,
    utilizationStatus,
    utilizationTrends,
    
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
