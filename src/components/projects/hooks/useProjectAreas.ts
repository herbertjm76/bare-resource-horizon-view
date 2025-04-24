
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export const useProjectAreas = () => {
  const { company } = useCompany();

  const { data: projectAreas } = useQuery({
    queryKey: ['project_areas', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('project_areas')
        .select('*')
        .eq('company_id', company.id);

      if (error) {
        console.error('Error fetching project areas:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!company?.id,
  });

  const getAreaByCountry = (country: string) => {
    return projectAreas?.find(area => 
      area.name === country || area.code === country
    );
  };

  return { projectAreas, getAreaByCountry };
};
