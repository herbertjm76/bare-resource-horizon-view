
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface LeaveEntry {
  id?: string;
  member_id: string;
  date: string;
  hours: number;
  company_id: string;
  leave_type_id?: string;
  leave_type_name?: string;
  leave_type_color?: string;
}

export interface LeaveDetail {
  hours: number;
  leave_type_name: string;
  leave_type_color: string;
}

export interface LeaveDataByDate {
  totalHours: number;
  entries: LeaveDetail[];
}

export const useAnnualLeave = (month: Date) => {
  const [leaveData, setLeaveData] = useState<Record<string, Record<string, number>>>({});
  const [leaveDetails, setLeaveDetails] = useState<Record<string, Record<string, LeaveDataByDate>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Function to fetch annual leave data
  const fetchLeaveData = useCallback(async () => {
    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const monthStr = format(month, 'yyyy-MM');

      const { data, error } = await supabase.functions.invoke('get_annual_leaves', {
        body: { 
          company_id_param: company.id,
          month_param: monthStr
        }
      });

      if (error) {
        console.error('Error fetching leave data:', error);
        toast.error('Failed to load annual leave data');
        setIsLoading(false);
        return;
      }

      // Transform data into nested structure by member_id and date
      const formattedData: Record<string, Record<string, number>> = {};
      const detailedData: Record<string, Record<string, LeaveDataByDate>> = {};
      
      if (data) {
        data.forEach((leave: any) => {
          // Simple hours data (existing format)
          if (!formattedData[leave.member_id]) {
            formattedData[leave.member_id] = {};
          }
          formattedData[leave.member_id][leave.date] = 
            (formattedData[leave.member_id][leave.date] || 0) + leave.hours;
          
          // Detailed data with leave type info
          if (!detailedData[leave.member_id]) {
            detailedData[leave.member_id] = {};
          }
          if (!detailedData[leave.member_id][leave.date]) {
            detailedData[leave.member_id][leave.date] = { totalHours: 0, entries: [] };
          }
          detailedData[leave.member_id][leave.date].totalHours += leave.hours;
          detailedData[leave.member_id][leave.date].entries.push({
            hours: leave.hours,
            leave_type_name: leave.leave_type_name || 'Leave',
            leave_type_color: leave.leave_type_color || '#3B82F6'
          });
        });
      }

      setLeaveData(formattedData);
      setLeaveDetails(detailedData);
    } catch (error) {
      console.error('Error in fetchLeaveData:', error);
      toast.error('Failed to load annual leave data');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, month]);

  // Update or create leave entries
  const updateLeaveHours = useCallback(async (
    memberId: string,
    date: string,
    hours: number
  ) => {
    if (!company?.id) return;

    try {
      setLeaveData(prev => {
        const updated = { ...prev };
        if (!updated[memberId]) {
          updated[memberId] = {};
        }
        
        if (hours === 0) {
          delete updated[memberId][date];
          if (Object.keys(updated[memberId]).length === 0) {
            delete updated[memberId];
          }
        } else {
          updated[memberId][date] = hours;
        }
        
        return updated;
      });

      const { data: existingData, error: checkError } = await supabase.functions.invoke('check_annual_leave_entry', {
        body: {
          member_id_param: memberId,
          date_param: date,
          company_id_param: company.id
        }
      });

      if (checkError) {
        console.error('Error checking leave entry:', checkError);
        throw checkError;
      }

      if (hours === 0 && existingData?.id) {
        await supabase.functions.invoke('delete_annual_leave', {
          body: {
            leave_id_param: existingData.id
          }
        });
      } else if (hours > 0) {
        if (existingData?.id) {
          await supabase.functions.invoke('update_annual_leave', {
            body: {
              leave_id_param: existingData.id,
              hours_param: hours
            }
          });
        } else {
          await supabase.functions.invoke('create_annual_leave', {
            body: {
              member_id_param: memberId,
              date_param: date,
              hours_param: hours,
              company_id_param: company.id
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating leave hours:', error);
      toast.error('Failed to update leave hours');
      fetchLeaveData();
    }
  }, [company?.id, fetchLeaveData]);

  const realtimeRefreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (company?.id) {
      fetchLeaveData();
    }
  }, [company?.id, month, fetchLeaveData]);

  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`annual-leaves-calendar:${company.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'annual_leaves',
          filter: `company_id=eq.${company.id}`,
        },
        () => {
          if (realtimeRefreshTimerRef.current) {
            window.clearTimeout(realtimeRefreshTimerRef.current);
          }
          realtimeRefreshTimerRef.current = window.setTimeout(() => {
            fetchLeaveData();
          }, 300);
        }
      )
      .subscribe();

    return () => {
      if (realtimeRefreshTimerRef.current) {
        window.clearTimeout(realtimeRefreshTimerRef.current);
        realtimeRefreshTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [company?.id, fetchLeaveData]);

  return {
    leaveData,
    leaveDetails,
    isLoading,
    updateLeaveHours,
    refreshLeaveData: fetchLeaveData
  };
};
