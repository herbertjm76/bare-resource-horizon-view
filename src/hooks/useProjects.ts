
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjects = () => {
  console.log('useProjects hook called');
  
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects data...');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_manager:profiles(first_name, last_name),
          office:offices(name, country),
          team_composition:project_team_composition(*)
        `);

      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
        throw error;
      }

      console.log('Projects data fetched successfully:', data);
      return data || [];
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  console.log('useProjects hook state:', { 
    projectsLength: projects?.length || 0, 
    isLoading, 
    hasError: !!error 
  });

  return {
    projects: projects || [],
    isLoading,
    error,
    refetch
  };
};
