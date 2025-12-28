
import { useMemo } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { combineStaffData } from './utils/dataTransformations';
import { createMockData, createSmartInsightsData } from './utils/mockDataUtils';

export const useAggregatedData = (
  teamMembers: any[],
  preRegisteredMembers: any[],
  timeRangeMetrics: any,
  currentUtilizationRate: number,
  memberUtilizations?: any[]
) => {
  const { workWeekHours } = useAppSettings();

  return useMemo(() => {
    const transformedStaffData = combineStaffData(teamMembers, preRegisteredMembers, memberUtilizations, workWeekHours);
    const totalTeamSize = transformedStaffData.length;
    const mockData = createMockData(timeRangeMetrics);
    const smartInsightsData = createSmartInsightsData(
      transformedStaffData,
      timeRangeMetrics.activeProjects,
      currentUtilizationRate,
      totalTeamSize
    );

    return {
      transformedStaffData,
      totalTeamSize,
      mockData,
      smartInsightsData
    };
  }, [teamMembers, preRegisteredMembers, timeRangeMetrics, currentUtilizationRate, memberUtilizations, workWeekHours]);
};
