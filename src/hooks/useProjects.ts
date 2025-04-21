
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

export const useProjects = () => {
  const { company } = useCompany();
  console.log('useProjects hook called', { hasCompany: !!company });
  
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      if (!company) {
        console.log('No company available, cannot fetch projects');
        return [];
      }
      
      console.log('Fetching projects data for company:', company.id);
      
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

      console.log('Projects data fetched successfully:', data);
      return data || [];
    },
    enabled: !!company,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  console.log('useProjects hook state:', { 
    projectsLength: projects?.length || 0, 
    isLoading, 
    hasError: !!error,
    companyId: company?.id
  });

  return {
    projects: projects || [],
    isLoading,
    error,
    refetch
  };
};
