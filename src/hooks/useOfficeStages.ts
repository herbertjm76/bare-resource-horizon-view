import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const useOfficeStages = () => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['office-stages', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_stages')
        .select('*')
        .eq('company_id', company.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
  });
};
