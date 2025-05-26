
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceProjectsProps {
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceProjects = ({ filters }: UseWeekResourceProjectsProps) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['week-resource-projects', company?.id, filters.office, filters.searchTerm],
    queryFn: async () => {
      if (!company?.id) return [];
      
      try {
        let query = supabase
          .from('projects')
          .select('id, name, code, office:offices(id, name, country)');
          
        // Add company filter
        query = query.eq('company_id', company.id);
        
        // Apply office filter if needed
        if (filters.office !== 'all') {
          // Need to match by office name from the joined offices table
          query = query.eq('office.name', filters.office);
        }
        
        // Apply search filter if provided
        if (filters.searchTerm) {
          query = query.or(`name.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching projects:', error);
          throw new Error(`Error fetching projects: ${error.message}`);
        }
        
        console.log('Fetched projects:', data);
        return data || [];
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        throw err;
      }
    },
    enabled: !!company?.id
  });
};
