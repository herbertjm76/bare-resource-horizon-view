
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from 'date-fns';
import { TimeRange } from '../TimeRangeSelector';
import { logger } from '@/utils/logger';

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
          case 'week':
          default:
            rangeStart = startOfWeek(now, { weekStartsOn: 1 });
            rangeEnd = endOfWeek(now, { weekStartsOn: 1 });
            break;
        }

        const rangeStartStr = format(rangeStart, 'yyyy-MM-dd');
        const rangeEndStr = format(rangeEnd, 'yyyy-MM-dd');

        logger.debug(`Fetching allocations for member ${memberId} for ${timeRange || 'week'} ${rangeStartStr} to ${rangeEndStr}`);

        // Query project_resource_allocations with project details
        // RULEBOOK: Filter by resource_type='active' for active team views
        const { data: allocationData, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            hours,
            allocation_date,
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
          .eq('resource_type', 'active')
          .gte('allocation_date', rangeStartStr)
          .lte('allocation_date', rangeEndStr)
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
            weekStartDate: allocation.allocation_date
          }));

          logger.debug(`Found ${formattedAllocations.length} allocations for member ${memberId}:`, formattedAllocations);
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
