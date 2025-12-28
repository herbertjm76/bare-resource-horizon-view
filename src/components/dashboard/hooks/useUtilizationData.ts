
import { useMemo } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import {
  calculateUtilizationRate,
  getUtilizationStatus,
  generateUtilizationTrends
} from './utils/utilizationCalculations';

export const useUtilizationData = (teamMembers: any[], preRegisteredMembers: any[]) => {
  const { workWeekHours } = useAppSettings();

  return useMemo(() => {
    const currentUtilizationRate = calculateUtilizationRate(teamMembers, preRegisteredMembers, workWeekHours);
    const utilizationStatus = getUtilizationStatus(currentUtilizationRate);
    const utilizationTrends = generateUtilizationTrends(currentUtilizationRate);

    return {
      currentUtilizationRate,
      utilizationStatus,
      utilizationTrends
    };
  }, [teamMembers, preRegisteredMembers, workWeekHours]);
};
