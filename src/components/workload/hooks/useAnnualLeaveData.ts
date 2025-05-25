
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './types';

export const useAnnualLeaveData = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined,
  workload: Record<string, Record<string, WorkloadBreakdown>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) return;

    const fetchAnnualLeaveData = async () => {
      setIsLoading(true);
      
      try {
        const monthStart = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1), 'yyyy-MM-dd');
        const monthEnd = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0), 'yyyy-MM-dd');
        const memberIds = teamMembers.map(member => member.id);

        console.log('Fetching annual leave data for member IDs:', memberIds);

        const { data: annualLeaveData, error } = await supabase
          .from('annual_leaves')
          .select('member_id, date, hours')
          .eq('company_id', companyId)
          .in('member_id', memberIds)
          .gte('date', monthStart)
          .lte('date', monthEnd);
        
        if (error) {
          console.error('Error fetching annual leave data:', error);
        } else if (annualLeaveData) {
          annualLeaveData.forEach(leave => {
            const dateKey = format(new Date(leave.date), 'yyyy-MM-dd');
            const hours = Number(leave.hours) || 0;
            
            if (workload[leave.member_id] && workload[leave.member_id][dateKey]) {
              workload[leave.member_id][dateKey].annualLeave += hours;
            }
          });
        }
      } catch (error) {
        console.error('Error in fetchAnnualLeaveData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnualLeaveData();
  }, [companyId, selectedMonth, teamMembers, workload]);

  return { isLoading };
};
