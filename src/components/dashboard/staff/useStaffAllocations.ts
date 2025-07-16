
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from 'date-fns';
import { TimeRange } from '../TimeRangeSelector';

interface StaffAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
  weekStartDate: string;
}

export const useStaffAllocations = (memberId: string | null, timeRange?: TimeRange) => {
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
        // Get date range based on selected time range
        const now = new Date();
        let rangeStart: Date;
        let rangeEnd: Date;

        switch (timeRange) {
          case 'month':
            rangeStart = startOfMonth(now);
            rangeEnd = endOfMonth(now);
            break;
          case '3months':
            rangeStart = startOfMonth(addMonths(now, -2));
            rangeEnd = endOfMonth(now);
            break;
          case '4months':
            rangeStart = startOfMonth(addMonths(now, -3));
            rangeEnd = endOfMonth(now);
            break;
          case '6months':
            rangeStart = startOfMonth(addMonths(now, -5));
            rangeEnd = endOfMonth(now);
            break;
          case 'year':
            rangeStart = startOfYear(now);
            rangeEnd = endOfYear(now);
            break;
          case 'week':
          default:
            rangeStart = startOfWeek(now, { weekStartsOn: 1 });
            rangeEnd = endOfWeek(now, { weekStartsOn: 1 });
            break;
        }

        const rangeStartStr = format(rangeStart, 'yyyy-MM-dd');
        const rangeEndStr = format(rangeEnd, 'yyyy-MM-dd');

        console.log(`Fetching allocations for member ${memberId} for ${timeRange || 'week'} ${rangeStartStr} to ${rangeEndStr}`);

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
          .gte('week_start_date', rangeStartStr)
          .lte('week_start_date', rangeEndStr)
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
  }, [memberId, company?.id, timeRange]);

  return { allocations, isLoading };
};
