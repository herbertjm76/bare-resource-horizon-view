
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceProjectsOptions {
  filters?: any;
  enabled?: boolean;
}

export const useWeekResourceProjects = ({ filters, enabled = true }: UseWeekResourceProjectsOptions = {}) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['week-resource-projects', company?.id, filters],
    queryFn: async () => {
      if (!company?.id) {
        return [];
      }
      
      let query = supabase
        .from('projects')
        .select('id, code, name, status, department')
        .eq('company_id', company.id);
      
      // Apply department filter
      if (filters?.department && filters.department !== 'all') {
        query = query.eq('department', filters.department);
      }
      
      const { data, error } = await query
        .order('code', { ascending: true })
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!company?.id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
