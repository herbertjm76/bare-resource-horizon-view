import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TimeRange } from '../TimeRangeSelector';
import { ChatGPTDashboardService, ChatGPTDashboardData } from '@/services/chatgptDashboardService';

// Feature flag to temporarily disable ChatGPT features for performance
const CHATGPT_FEATURES_ENABLED = false;

export const useChatGPTDashboardData = (selectedTimeRange: TimeRange) => {
  const { company } = useCompany();
  const [data, setData] = useState<ChatGPTDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CHATGPT_FEATURES_ENABLED) {
      setIsLoading(false);
      setError('ChatGPT features temporarily disabled for improved performance');
      console.log('🤖 ChatGPT features temporarily disabled');
      return;
    }

    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🤖 Fetching ChatGPT dashboard data for:', { 
          companyId: company.id, 
          timeRange: selectedTimeRange 
        });

        const result = await ChatGPTDashboardService.calculateDashboardData(
          company.id, 
          selectedTimeRange
        );

        console.log('✅ ChatGPT dashboard data received:', result);
        setData(result);
      } catch (err) {
        console.error('❌ Error fetching ChatGPT dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [company?.id, selectedTimeRange]);

  const refetch = async () => {
    if (!company?.id) return;
    
    try {
      setError(null);
      const result = await ChatGPTDashboardService.calculateDashboardData(
        company.id, 
        selectedTimeRange
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refetch data');
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};