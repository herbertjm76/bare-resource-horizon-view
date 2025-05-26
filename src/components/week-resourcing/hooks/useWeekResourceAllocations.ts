
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceAllocationsProps {
  weekStartDate: string;
}

export const useWeekResourceAllocations = ({ weekStartDate }: UseWeekResourceAllocationsProps) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['week-resource-allocations', company?.id, weekStartDate],
    queryFn: async () => {
      if (!company?.id) return [];
      
      try {
        // Try to fetch with the exact date
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            id,
            project_id,
            resource_id,
            resource_type,
            hours,
            week_start_date
          `)
          .eq('company_id', company.id)
          .eq('week_start_date', weekStartDate);
          
        if (error) {
          throw new Error(`Error fetching allocations: ${error.message}`);
        }
        
        console.log('Fetched allocations for week:', weekStartDate, data);
        return data || [];
      } catch (error) {
        console.error('Error in allocation query:', error);
        return [];
      }
    },
    enabled: !!company?.id
  });
};
