
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
      
      const rawData = data?.[0];
      if (!rawData) return null;
      
      // Ensure all values are properly converted to numbers
      return {
        total_budget: Number(rawData.total_budget || 0),
        total_spent: Number(rawData.total_spent || 0),
        total_revenue: Number(rawData.total_revenue || 0),
        profit_margin: Number(rawData.profit_margin || 0),
        budget_variance: Number(rawData.budget_variance || 0),
        schedule_variance: Number(rawData.schedule_variance || 0),
        consumed_hours: Number(rawData.consumed_hours || 0),
        budget_hours: Number(rawData.budget_hours || 0),
        blended_rate: Number(rawData.blended_rate || 0),
        burn_rate: Number(rawData.burn_rate || 0),
      } as FinancialMetrics;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
