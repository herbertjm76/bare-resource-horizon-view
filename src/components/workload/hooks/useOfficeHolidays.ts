
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, eachDayOfInterval } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export const useOfficeHolidays = (
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
          setData({});
        } else if (holidaysData) {
          const holidayHours: Record<string, Record<string, number>> = {};
          
          // Initialize structure
          memberIds.forEach(memberId => {
            holidayHours[memberId] = {};
          });
          
          holidaysData.forEach(holiday => {
            const startDate = new Date(holiday.date);
            const endDate = holiday.end_date ? new Date(holiday.end_date) : startDate;
            
            const holidayDays = eachDayOfInterval({ start: startDate, end: endDate });
            
            holidayDays.forEach(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              
              if (day.getMonth() === selectedMonth.getMonth() && 
                  day.getFullYear() === selectedMonth.getFullYear()) {
                
                memberIds.forEach(memberId => {
                  holidayHours[memberId][dateKey] = 8; // Standard 8-hour holiday
                });
              }
            });
          });
          
          console.log('Processed office holidays data:', holidayHours);
          setData(holidayHours);
        }
      } catch (error) {
        console.error('Error in fetchOfficeHolidays:', error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficeHolidays();
  }, [companyId, selectedMonth, teamMembers]);

  return { data, isLoading };
};
