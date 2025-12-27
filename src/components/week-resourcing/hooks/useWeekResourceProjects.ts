
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceProjectsOptions {
  filters?: any;
  enabled?: boolean;
}

export const useWeekResourceProjects = ({ filters, enabled = true }: UseWeekResourceProjectsOptions = {}) => {
  const { company, loading: companyLoading, error: companyError } = useCompany();

  // Derive a stable company ID - only consider ready when we have both company and ID
  const companyId = company?.id;
  const isCompanyReady = !companyLoading && !!companyId && !companyError;

  return useQuery({
    queryKey: ['week-resource-projects', companyId, filters],
    queryFn: async () => {
      // Double-check we have a valid company ID before querying
      if (!companyId) {
        return [];
      }
      
      let query = supabase
        .from('projects')
        .select('id, code, name, status, department')
        .eq('company_id', companyId);
      
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
    // Only enable when we have a valid company ID and context is not loading
    enabled: isCompanyReady && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Keep previous data while refetching to prevent flicker
    placeholderData: (previousData) => previousData,
  });
};
