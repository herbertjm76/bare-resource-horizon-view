
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceProjectsOptions {
  filters?: { department?: string };
  enabled?: boolean;
}

export const useWeekResourceProjects = ({ filters, enabled = true }: UseWeekResourceProjectsOptions = {}) => {
  const { company, loading: companyLoading, error: companyError } = useCompany();

  const companyId = company?.id;
  // CRITICAL: Only fetch when company context is fully ready
  const canFetch = !companyLoading && !!companyId && !companyError && enabled;

  return useQuery({
    queryKey: ['week-resource-projects', companyId, filters],
    queryFn: async () => {
      if (!companyId) return [];

      let query = supabase
        .from('projects')
        .select('id, code, name, status, department')
        .eq('company_id', companyId);

      if (filters?.department && filters.department !== 'all') {
        query = query.eq('department', filters.department);
      }

      const { data, error } = await query
        .order('code', { ascending: true })
        .order('id', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: canFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
