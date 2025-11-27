
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];

export type ProjectSortBy = 'name' | 'code' | 'status' | 'created';

export const useProjects = (sortBy: ProjectSortBy = 'created', sortDirection: 'asc' | 'desc' = 'asc') => {
  const { company, loading: companyLoading } = useCompany();

  useEffect(() => {
    console.log('useProjects hook effect triggered', { 
      hasCompany: !!company,
      companyLoading,
      companyId: company?.id 
    });
  }, [company, companyLoading]);
  
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', company?.id, sortBy, sortDirection],
    queryFn: async () => {
      if (!company) {
        console.log('No company available, cannot fetch projects');
        return [];
      }
      
      console.log('Fetching projects data for company:', company.id);
      
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
          .eq('company_id', company.id);

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
    enabled: !!company && !companyLoading,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  console.log('useProjects hook state:', { 
    projectsLength: projects?.length || 0, 
    isLoading, 
    hasError: !!error,
    companyId: company?.id,
    companyLoading
  });

  // This is a debug helper to help track if we're stuck in loading
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('useProjects still loading after 5 seconds', {
          companyLoading,
          hasCompany: !!company,
          enabled: !!company && !companyLoading
        });
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, company, companyLoading]);

  return {
    projects: projects || [],
    isLoading: isLoading || companyLoading,
    error,
    refetch
  };
};

