
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_PROJECTS, DEMO_COMPANY_ID } from '@/data/demoData';

interface UseWeekResourceProjectsOptions {
  filters?: { department?: string };
  enabled?: boolean;
}

export const useWeekResourceProjects = ({ filters, enabled = true }: UseWeekResourceProjectsOptions = {}) => {
  const { companyId, isReady } = useCompanyId();
  const { isDemoMode } = useDemoAuth();

  // CRITICAL: Only fetch when company context is fully ready and externally enabled
  const canFetch = (isDemoMode || isReady) && enabled;

  return useQuery({
    queryKey: ['week-resource-projects', isDemoMode ? DEMO_COMPANY_ID : companyId, filters],
    queryFn: async () => {
      // Demo mode: Return demo projects
      if (isDemoMode) {
        let projects = DEMO_PROJECTS.map(p => ({
          id: p.id,
          code: p.code,
          name: p.name,
          status: p.status,
          department: p.department
        }));

        if (filters?.department && filters.department !== 'all') {
          projects = projects.filter(p => p.department === filters.department);
        }

        return projects.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
      }

      // Real mode
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
