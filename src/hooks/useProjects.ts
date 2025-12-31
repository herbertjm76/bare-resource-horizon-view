
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompanyId } from '@/hooks/useCompanyId';
import { logger } from '@/utils/logger';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export type ProjectSortBy = 'name' | 'code' | 'status' | 'created';

export const useProjects = (sortBy: ProjectSortBy = 'created', sortDirection: 'asc' | 'desc' = 'asc') => {
  const { companyId, isReady, isLoading: companyLoading, error: companyError } = useCompanyId();
  
  const { data: projects, isLoading: queryLoading, error, refetch } = useQuery({
    queryKey: ['projects', companyId, sortBy, sortDirection],
    queryFn: async () => {
      // Safety check - should never happen if enabled is correct
      if (!companyId) {
        logger.warn('useProjects: queryFn called without companyId');
        return [];
      }
      
      logger.log('useProjects: Fetching projects for company:', companyId);
      
      try {
        let query = supabase
          .from('projects')
          .select(`
            id,
            name,
            code,
            status,
            country,
            department,
            target_profit_percentage,
            current_stage,
            stages,
            currency,
            project_manager:profiles(id, first_name, last_name, avatar_url),
            office:offices(id, name, country)
          `)
          .eq('company_id', companyId);

        // Apply sorting based on sortBy parameter
        const ascending = sortDirection === 'asc';
        
        switch (sortBy) {
          case 'code':
            query = query.order('code', { ascending }).order('name', { ascending });
            break;
          case 'status':
            query = query.order('status', { ascending }).order('name', { ascending });
            break;
          case 'created':
            query = query.order('created_at', { ascending });
            break;
          case 'name':
          default:
            query = query.order('name', { ascending }).order('code', { ascending });
            break;
        }
        
        // Always add ID as final tie-breaker for stability
        query = query.order('id', { ascending: true });

        const { data, error } = await query;

        if (error) {
          logger.error('useProjects: Error fetching projects:', error);
          toast.error('Failed to load projects');
          throw error;
        }

        logger.log('useProjects: Fetched', data?.length || 0, 'projects');
        return data || [];
      } catch (err) {
        logger.error('useProjects: Exception:', err);
        throw err;
      }
    },
    // CRITICAL: Only enable when company context is fully ready
    enabled: isReady,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    // Keep previous data while refetching to prevent flicker
    placeholderData: (previousData) => previousData,
  });

  // Determine proper loading state:
  // - If company is loading, we're loading
  // - If isReady is true but query is loading, we're loading
  // - If isReady is false (no company), we're NOT loading (we're done - nothing to fetch)
  const isLoading = companyLoading || (isReady && queryLoading);

  return {
    projects: projects || [],
    isLoading,
    error: error || (companyError ? new Error(companyError) : null),
    refetch
  };
};
