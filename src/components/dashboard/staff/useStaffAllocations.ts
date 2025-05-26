
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface StaffAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
  weekStartDate: string;
}

export const useStaffAllocations = (memberId: string | null) => {
  const [allocations, setAllocations] = useState<StaffAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    if (!memberId || !company?.id) {
      setAllocations([]);
      return;
    }

    const fetchAllocations = async () => {
      setIsLoading(true);
      
      try {
        // Get current week range
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        const weekStartStr = format(weekStart, 'yyyy-MM-dd');
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

        console.log(`Fetching allocations for member ${memberId} for week ${weekStartStr}`);

        // Query project_resource_allocations with project details
        const { data: allocationData, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            hours,
            week_start_date,
            project_id,
            resource_type,
            projects!inner (
              id,
              name,
              code
            )
          `)
          .eq('resource_id', memberId)
          .eq('company_id', company.id)
          .gte('week_start_date', weekStartStr)
          .lte('week_start_date', weekEndStr)
          .gt('hours', 0);

        if (error) {
          console.error('Error fetching staff allocations:', error);
          setAllocations([]);
        } else {
          const formattedAllocations: StaffAllocation[] = (allocationData || []).map(allocation => ({
            projectId: allocation.projects.id,
            projectName: allocation.projects.name,
            projectCode: allocation.projects.code,
            hours: Number(allocation.hours),
            weekStartDate: allocation.week_start_date
          }));

          console.log(`Found ${formattedAllocations.length} allocations for member ${memberId}:`, formattedAllocations);
          setAllocations(formattedAllocations);
        }
      } catch (error) {
        console.error('Error in fetchAllocations:', error);
        setAllocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllocations();
  }, [memberId, company?.id]);

  return { allocations, isLoading };
};
