import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface OfficeRole {
  id: string;
  name: string;
  code: string;
}

export const useOfficeRoles = () => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['office-roles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_roles')
        .select('id, name, code')
        .eq('company_id', company.id)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as OfficeRole[];
    },
    enabled: !!company?.id,
  });
};
