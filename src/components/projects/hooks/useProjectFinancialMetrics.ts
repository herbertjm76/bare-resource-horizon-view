
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjectFinancialMetrics = (projectId: string) => {
  return useQuery({
    queryKey: ['project-financial-metrics', projectId],
    queryFn: async () => {
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
