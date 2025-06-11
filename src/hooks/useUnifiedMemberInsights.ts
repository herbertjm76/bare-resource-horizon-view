
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { UnifiedInsightsService, UnifiedMemberInsights } from '@/services/unifiedInsightsService';

export const useUnifiedMemberInsights = (memberId: string, weeklyCapacity: number = 40) => {
  const [insights, setInsights] = useState<UnifiedMemberInsights>({
    utilizationInsights: [],
    projectLoadInsights: [],
    capacityInsights: [],
    trendInsights: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { company } = useCompany();

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
          weeklyCapacity
        );
        
        setInsights(memberInsights);
      } catch (err) {
        console.error('Error fetching unified insights:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [company?.id, memberId, weeklyCapacity]);

  return {
    insights,
    isLoading,
    error,
    refetch: () => {
      if (company?.id && memberId) {
        setIsLoading(true);
        UnifiedInsightsService.generateMemberInsights(memberId, company.id, weeklyCapacity)
          .then(setInsights)
          .catch(setError)
          .finally(() => setIsLoading(false));
      }
    }
  };
};
