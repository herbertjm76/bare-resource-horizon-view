
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export const useAnnualLeaveData = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined
) => {
  const [data, setData] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) {
      setData({});
      setIsLoading(false);
      return;
    }

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
          setData({});
        } else if (annualLeaveData) {
          const leaveHours: Record<string, Record<string, number>> = {};
          
          // Initialize structure
          memberIds.forEach(memberId => {
            leaveHours[memberId] = {};
          });
          
          annualLeaveData.forEach(leave => {
            const dateKey = format(new Date(leave.date), 'yyyy-MM-dd');
            const hours = Number(leave.hours) || 0;
            
            if (!leaveHours[leave.member_id][dateKey]) {
              leaveHours[leave.member_id][dateKey] = 0;
            }
            leaveHours[leave.member_id][dateKey] += hours;
          });
          
          console.log('Processed annual leave data:', leaveHours);
          setData(leaveHours);
        }
      } catch (error) {
        console.error('Error in fetchAnnualLeaveData:', error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnualLeaveData();
  }, [companyId, selectedMonth, teamMembers]);

  return { data, isLoading };
};
