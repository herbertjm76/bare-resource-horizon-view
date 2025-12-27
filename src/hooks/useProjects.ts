
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export type ProjectSortBy = 'name' | 'code' | 'status' | 'created';

export const useProjects = (sortBy: ProjectSortBy = 'created', sortDirection: 'asc' | 'desc' = 'asc') => {
  const { company, loading: companyLoading, error: companyError } = useCompany();

  // Derive a stable company ID - only consider ready when we have both company and ID
  const companyId = company?.id;
  const isCompanyReady = !companyLoading && !!companyId && !companyError;

  useEffect(() => {
    console.log('useProjects hook effect triggered', { 
      hasCompany: !!company,
      companyLoading,
      companyId,
      isCompanyReady,
      companyError
    });
  }, [company, companyLoading, companyId, isCompanyReady, companyError]);
  
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', companyId, sortBy, sortDirection],
    queryFn: async () => {
      // Double-check we have a valid company ID before querying
      if (!companyId) {
        console.log('No company ID available, cannot fetch projects');
        return [];
      }
      
      console.log('Fetching projects data for company:', companyId);
      
      try {
        // Select projects with deterministic ordering based on sortBy parameter
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
          console.error('Error fetching projects:', error);
          toast.error('Failed to load projects');
          throw error;
        }

        console.log('Projects data fetched successfully:', data?.length || 0, 'projects found');
        console.log('Sample project data:', data?.[0] || 'No projects');
        return data || [];
      } catch (err) {
        console.error('Exception in projects fetch:', err);
        throw err;
      }
    },
    // Only enable when we have a valid company ID and context is not loading
    enabled: isCompanyReady,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    // Keep previous data while refetching to prevent flicker
    placeholderData: (previousData) => previousData,
  });

  console.log('useProjects hook state:', { 
    projectsLength: projects?.length || 0, 
    isLoading, 
    hasError: !!error,
    companyId,
    companyLoading,
    isCompanyReady
  });

  // This is a debug helper to help track if we're stuck in loading
  useEffect(() => {
    if (isLoading || companyLoading) {
      const timeout = setTimeout(() => {
        console.log('useProjects still loading after 5 seconds', {
          companyLoading,
          hasCompany: !!company,
          companyId,
          isCompanyReady
        });
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, company, companyLoading, companyId, isCompanyReady]);

  return {
    projects: projects || [],
    // Only show loading when the context is loading or the query is actively fetching.
    // If company cannot be resolved, we should not spin forever.
    isLoading: companyLoading || isLoading,
    error: error || (companyError ? new Error(companyError) : null),
    refetch
  };
};

