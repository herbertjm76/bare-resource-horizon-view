
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FinancialMetrics {
  total_budget: number;
  total_spent: number;
  total_revenue: number;
  profit_margin: number;
  budget_variance: number;
  schedule_variance: number;
  consumed_hours: number;
  budget_hours: number;
  blended_rate: number;
  burn_rate: number;
}

export const useProjectFinancialMetrics = (projectId: string) => {
  return useQuery({
    queryKey: ['project-financial-metrics', projectId],
    queryFn: async (): Promise<FinancialMetrics | null> => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .rpc('calculate_project_financial_metrics', {
          project_uuid: projectId
        });
      
      if (error) {
        console.error('Error fetching financial metrics:', error);
        throw error;
      }
      
      return data?.[0] || null;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
