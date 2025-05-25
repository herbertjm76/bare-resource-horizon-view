
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, eachDayOfInterval } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './types';

export const useOfficeHolidays = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined,
  workload: Record<string, Record<string, WorkloadBreakdown>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) return;

    const fetchOfficeHolidays = async () => {
      setIsLoading(true);
      
      try {
        const monthStart = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1), 'yyyy-MM-dd');
        const monthEnd = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0), 'yyyy-MM-dd');
        const memberIds = teamMembers.map(member => member.id);

        console.log('Fetching office holidays for company:', companyId);

        const { data: holidaysData, error } = await supabase
          .from('office_holidays')
          .select('date, end_date, name')
          .eq('company_id', companyId)
          .or(`date.lte.${monthEnd},end_date.gte.${monthStart}`);
        
        if (error) {
          console.error('Error fetching office holidays:', error);
        } else if (holidaysData) {
          holidaysData.forEach(holiday => {
            const startDate = new Date(holiday.date);
            const endDate = holiday.end_date ? new Date(holiday.end_date) : startDate;
            
            const holidayDays = eachDayOfInterval({ start: startDate, end: endDate });
            
            holidayDays.forEach(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              
              if (day.getMonth() === selectedMonth.getMonth() && 
                  day.getFullYear() === selectedMonth.getFullYear()) {
                
                memberIds.forEach(memberId => {
                  if (workload[memberId] && workload[memberId][dateKey]) {
                    workload[memberId][dateKey].officeHolidays = 8;
                  }
                });
              }
            });
          });
        }
      } catch (error) {
        console.error('Error in fetchOfficeHolidays:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficeHolidays();
  }, [companyId, selectedMonth, teamMembers, workload]);

  return { isLoading };
};
