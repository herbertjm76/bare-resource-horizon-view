
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useEffect } from 'react';

export const useProjects = () => {
  const { company, loading: companyLoading } = useCompany();
  
  useEffect(() => {
    console.log('useProjects hook effect triggered', { 
      hasCompany: !!company,
      companyLoading,
      companyId: company?.id 
    });
  }, [company, companyLoading]);
  
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      if (!company) {
        console.log('No company available, cannot fetch projects');
        return [];
      }
      
      console.log('Fetching projects data for company:', company.id);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_manager:profiles(first_name, last_name),
            office:offices(name, country),
            team_composition:project_team_composition(*)
          `)
          .eq('company_id', company.id);

        if (error) {
          console.error('Error fetching projects:', error);
          toast.error('Failed to load projects');
          throw error;
        }

        console.log('Projects data fetched successfully:', data?.length || 0, 'projects found');
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
