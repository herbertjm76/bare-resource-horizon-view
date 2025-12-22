
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
}

export const useAnnualLeave = (month: Date) => {
  const [leaveData, setLeaveData] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company, loading: companyLoading } = useCompany();

  // Function to fetch annual leave data
  const fetchLeaveData = useCallback(async () => {
    if (!company?.id) {
      // If no company ID, we can't fetch - but don't leave loading stuck
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Format month for query: YYYY-MM
      const monthStr = format(month, 'yyyy-MM');
      
      console.log('useAnnualLeave - Fetching leave data for:', { companyId: company.id, month: monthStr });

      // Fetch all leaves for the month using the edge function
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
      
      if (data) {
        data.forEach((leave: any) => {
          if (!formattedData[leave.member_id]) {
            formattedData[leave.member_id] = {};
          }
          formattedData[leave.member_id][leave.date] = leave.hours;
        });
      }

      console.log('useAnnualLeave - Fetched leave data:', { 
        entriesCount: data?.length || 0, 
        formattedData 
      });

      setLeaveData(formattedData);
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
      // Update local state first (optimistic update)
      setLeaveData(prev => {
        const updated = { ...prev };
        if (!updated[memberId]) {
          updated[memberId] = {};
        }
        
        if (hours === 0) {
          // If hours is zero, remove the entry
          delete updated[memberId][date];
          // If no entries left for member, remove the member object
          if (Object.keys(updated[memberId]).length === 0) {
            delete updated[memberId];
          }
        } else {
          updated[memberId][date] = hours;
        }
        
        return updated;
      });

      // Use the edge function to check if entry exists
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
        // Delete entry if hours is zero and entry exists
        await supabase.functions.invoke('delete_annual_leave', {
          body: {
            leave_id_param: existingData.id
          }
        });
      } else if (hours > 0) {
        if (existingData?.id) {
          // Update existing entry
          await supabase.functions.invoke('update_annual_leave', {
            body: {
              leave_id_param: existingData.id,
              hours_param: hours
            }
          });
        } else {
          // Create new entry
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
      
      // Refresh data to ensure UI is in sync with database
      fetchLeaveData();
    }
  }, [company?.id, fetchLeaveData]);

  const realtimeRefreshTimerRef = useRef<number | null>(null);

  // Fetch data when component mounts or month changes
  useEffect(() => {
    if (company?.id) {
      fetchLeaveData();
    }
  }, [company?.id, month, fetchLeaveData]);

  // Subscribe to realtime changes on annual_leaves table
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
          // Debounce to handle bursts of updates
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
    isLoading: isLoading || companyLoading,
    updateLeaveHours,
    refreshLeaveData: fetchLeaveData
  };
};
