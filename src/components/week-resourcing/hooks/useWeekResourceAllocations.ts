
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, addDays, startOfWeek } from 'date-fns';

interface UseWeekResourceAllocationsProps {
  weekStartDate: string;
}

export const useWeekResourceAllocations = ({ weekStartDate }: UseWeekResourceAllocationsProps) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['week-resource-allocations', weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      // RULEBOOK: Weekly views show BOTH active AND pre_registered members
      // Fetch allocations for both resource types - no double-counting because member IDs are unique
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('allocation_date', weekStartDate)
        .in('resource_type', ['active', 'pre_registered']);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!company?.id && !!weekStartDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
