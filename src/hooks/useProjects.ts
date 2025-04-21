
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjects = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
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

        console.log('Projects data fetched:', data);
        return data || [];
      } catch (err) {
        console.error('Error in projects query:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });

  return {
    projects: projects || [],
    isLoading,
    error,
  };
};
