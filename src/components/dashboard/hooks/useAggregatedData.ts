
import { useMemo } from 'react';
import { combineStaffData } from './utils/dataTransformations';
import { createMockData, createSmartInsightsData } from './utils/mockDataUtils';

export const useAggregatedData = (
  teamMembers: any[],
  preRegisteredMembers: any[],
  timeRangeMetrics: any,
  currentUtilizationRate: number
) => {
  return useMemo(() => {
    const transformedStaffData = combineStaffData(teamMembers, preRegisteredMembers);
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
  }, [teamMembers, preRegisteredMembers, timeRangeMetrics, currentUtilizationRate]);
};
