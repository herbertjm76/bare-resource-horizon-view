import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';

export const useOfficeStages = () => {
  const { companyId, isReady } = useCompanyId();

  return useQuery({
    queryKey: ['office-stages', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('office_stages')
        .select('*')
        .eq('company_id', companyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: isReady,
  });
};
