import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_ROLES } from '@/data/demoData';

export interface OfficeRole {
  id: string;
  name: string;
  code: string;
}

export const useOfficeRoles = () => {
  const { isDemoMode } = useDemoAuth();
  const { companyId, isReady } = useCompanyId();

  return useQuery({
    queryKey: ['office-roles', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_ROLES.map(r => ({ id: r.id, name: r.name, code: r.code })) as OfficeRole[];
      }

      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('office_roles')
        .select('id, name, code')
        .eq('company_id', companyId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as OfficeRole[];
    },
    enabled: isDemoMode || isReady,
  });
};
