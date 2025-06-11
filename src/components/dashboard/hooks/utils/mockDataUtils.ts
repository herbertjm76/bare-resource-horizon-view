
export const createMockData = (timeRangeMetrics: any) => ({
  projectsByStatus: timeRangeMetrics.projectsByStatus,
  projectsByStage: timeRangeMetrics.projectsByStage,
  projectsByLocation: timeRangeMetrics.projectsByLocation,
  projectsByPM: timeRangeMetrics.projectsByPM || []
});

export const createSmartInsightsData = (
  transformedStaffData: any[],
  activeProjects: number,
  currentUtilizationRate: number,
  totalTeamSize: number
) => ({
  teamMembers: transformedStaffData,
  activeProjects,
  utilizationRate: currentUtilizationRate,
  totalTeamSize
});
