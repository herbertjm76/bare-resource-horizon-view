
import { useMemo } from 'react';
import { useIndividualUtilization } from './useIndividualUtilization';
import { TeamMember, PendingMember } from '../types';
import { TimeRange } from '../TimeRangeSelector';
import { logger } from '@/utils/logger';

interface UtilizationResult {
  utilizationRate: number;
  isLoading: boolean;
}

// Type guard to check if a member is pending
const isPendingMember = (member: TeamMember): member is PendingMember => {
  return 'isPending' in member && member.isPending === true;
};

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
    // Include ALL team members (active + pending) in the calculation
    const totalUtilization = teamMembers.reduce((sum, member) => {
      const memberUtilization = memberUtilizations[member.id] || 0;
      // For pending members, utilization should be 0
      const finalUtilization = isPendingMember(member) ? 0 : memberUtilization;
      return sum + finalUtilization;
    }, 0);

    const averageUtilization = totalUtilization / teamMembers.length;
    
    logger.log('📊 STANDARDIZED utilization calculation INCLUDING PENDING:', {
      selectedTimeRange,
      totalMembers: teamMembers.length,
      activeMembers: teamMembers.filter(m => !isPendingMember(m)).length,
      pendingMembers: teamMembers.filter(m => isPendingMember(m)).length,
      totalUtilization,
      averageUtilization: Math.round(averageUtilization),
      memberBreakdown: teamMembers.map(m => ({
        name: isPendingMember(m) ? 
          `${m.first_name || ''} ${m.last_name || ''}`.trim() : 
          `${m.first_name || ''} ${m.last_name || ''}`.trim(),
        isPending: isPendingMember(m),
        utilization: isPendingMember(m) ? 0 : (memberUtilizations[m.id] || 0)
      }))
    });

    return Math.round(averageUtilization);
  }, [memberUtilizations, teamMembers, isLoading, selectedTimeRange]);

  return {
    utilizationRate,
    isLoading
  };
};
