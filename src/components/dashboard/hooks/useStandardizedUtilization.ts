
import { useMemo } from 'react';
import { useIndividualUtilization } from './useIndividualUtilization';
import { TeamMember } from '../types';
import { TimeRange } from '../TimeRangeSelector';

interface UtilizationResult {
  utilizationRate: number;
  isLoading: boolean;
}

export const useStandardizedUtilization = (
  teamMembers: TeamMember[], 
  selectedTimeRange: TimeRange
): UtilizationResult => {
  const { memberUtilizations, isLoading } = useIndividualUtilization(teamMembers, selectedTimeRange);

  const utilizationRate = useMemo(() => {
    if (isLoading || !teamMembers.length) {
      return 0;
    }

    // Calculate team-wide utilization based on individual member utilizations
    const totalUtilization = teamMembers.reduce((sum, member) => {
      const memberUtilization = memberUtilizations[member.id] || 0;
      return sum + memberUtilization;
    }, 0);

    const averageUtilization = totalUtilization / teamMembers.length;
    
    console.log('Standardized utilization calculation:', {
      selectedTimeRange,
      totalMembers: teamMembers.length,
      totalUtilization,
      averageUtilization: Math.round(averageUtilization),
      memberUtilizations
    });

    return Math.round(averageUtilization);
  }, [memberUtilizations, teamMembers, isLoading, selectedTimeRange]);

  return {
    utilizationRate,
    isLoading
  };
};
