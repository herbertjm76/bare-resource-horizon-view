
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
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name, status')
        .eq('company_id', company.id)
        .order('code');

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Successfully fetched projects:', data?.length || 0);
      return data || [];
    },
    enabled: !!company?.id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
