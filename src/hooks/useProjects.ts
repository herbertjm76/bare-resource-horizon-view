
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProjects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_manager:profiles(first_name, last_name),
          office:offices(name, country),
          team_composition:project_team_composition(*)
        `);

      if (error) {
        throw error;
      }

      return data;
    },
  });

  return {
    projects,
    isLoading,
  };
};
