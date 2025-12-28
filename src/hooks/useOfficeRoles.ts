import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';

export interface OfficeRole {
  id: string;
  name: string;
  code: string;
}

export const useOfficeRoles = () => {
  const { companyId, isReady } = useCompanyId();

  return useQuery({
    queryKey: ['office-roles', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('office_roles')
        .select('id, name, code')
        .eq('company_id', companyId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as OfficeRole[];
    },
    enabled: isReady,
  });
};
