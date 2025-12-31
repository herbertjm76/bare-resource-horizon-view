
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { UnifiedInsightsService, UnifiedMemberInsights } from '@/services/unifiedInsightsService';
import { logger } from '@/utils/logger';

export const useUnifiedMemberInsights = (memberId: string, weeklyCapacity?: number) => {
  const [insights, setInsights] = useState<UnifiedMemberInsights>({
    utilizationInsights: [],
    projectLoadInsights: [],
    capacityInsights: [],
    trendInsights: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();

  const effectiveWeeklyCapacity = weeklyCapacity ?? workWeekHours;

  useEffect(() => {
    const fetchInsights = async () => {
      if (!company?.id || !memberId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const memberInsights = await UnifiedInsightsService.generateMemberInsights(
          memberId,
          company.id,
          effectiveWeeklyCapacity
        );
        
        setInsights(memberInsights);
      } catch (err) {
        logger.error('Error fetching unified insights:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [company?.id, memberId, effectiveWeeklyCapacity, workWeekHours]);

  return {
    insights,
    isLoading,
    error,
    refetch: () => {
      if (company?.id && memberId) {
        setIsLoading(true);
        UnifiedInsightsService.generateMemberInsights(memberId, company.id, effectiveWeeklyCapacity)
          .then(setInsights)
          .catch(setError)
          .finally(() => setIsLoading(false));
      }
    }
  };
};
