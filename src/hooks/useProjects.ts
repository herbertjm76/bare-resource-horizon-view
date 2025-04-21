
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

        return data || [];
      } catch (err) {
        console.error('Error in projects query:', err);
        throw err; // We'll let React Query handle the retry and error state
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    meta: {
      onError: (error: Error) => {
        console.error('React Query error in projects:', error);
        toast.error('Could not load projects data');
      }
    }
  });

  return {
    projects: projects || [],
    isLoading,
    error,
  };
};
