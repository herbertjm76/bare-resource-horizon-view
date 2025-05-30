
import { TimeRange } from '../../TimeRangeSelector';
import { InsightData } from '../types';
import { getUtilizationInsights } from './utilizationInsights';
import { getProjectLoadInsights } from './projectLoadInsights';
import { getTeamScalingInsights } from './teamScalingInsights';
import { getTimeBasedInsights } from './timeBasedInsights';
import { getCapacityInsights } from './capacityInsights';

export const getAllInsights = (
  utilizationRate: number,
  teamSize: number,
  activeProjects: number,
  selectedTimeRange: TimeRange
): InsightData[] => {
  const allInsights: InsightData[] = [
    ...getUtilizationInsights(utilizationRate),
    ...getProjectLoadInsights(activeProjects, teamSize),
    ...getTeamScalingInsights(teamSize, activeProjects, utilizationRate),
    ...getTimeBasedInsights(selectedTimeRange, utilizationRate),
    ...getCapacityInsights(utilizationRate, teamSize)
  ];

  return allInsights.sort((a, b) => a.priority - b.priority).slice(0, 3);
};
