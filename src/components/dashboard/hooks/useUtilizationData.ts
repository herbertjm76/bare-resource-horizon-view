
import { useMemo } from 'react';
import { 
  calculateUtilizationRate,
  getUtilizationStatus,
  generateUtilizationTrends
} from './utils/utilizationCalculations';

export const useUtilizationData = (teamMembers: any[], preRegisteredMembers: any[]) => {
  return useMemo(() => {
    const currentUtilizationRate = calculateUtilizationRate(teamMembers, preRegisteredMembers);
    const utilizationStatus = getUtilizationStatus(currentUtilizationRate);
    const utilizationTrends = generateUtilizationTrends(currentUtilizationRate);

    return {
      currentUtilizationRate,
      utilizationStatus,
      utilizationTrends
    };
  }, [teamMembers, preRegisteredMembers]);
};
