import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_STAGES, DEMO_COMPANY_ID } from '@/data/demoData';

export const useOfficeStages = () => {
  const { companyId, isReady } = useCompanyId();
  const { isDemoMode } = useDemoAuth();

  return useQuery({
    queryKey: ['office-stages', isDemoMode ? DEMO_COMPANY_ID : companyId],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_STAGES.map(s => ({
          id: s.id,
          company_id: s.company_id,
          name: s.name,
          code: s.code,
          color: s.color,
          order_index: s.order_index,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('office_stages')
        .select('*')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || isReady,
  });
};
