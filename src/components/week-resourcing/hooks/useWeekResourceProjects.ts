
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
        console.log('No company ID available for projects fetch');
        return [];
      }

      console.log('Fetching projects for company:', company.id);
      
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
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Successfully fetched projects:', data?.length || 0);
      return data || [];
    },
    enabled: !!company?.id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
