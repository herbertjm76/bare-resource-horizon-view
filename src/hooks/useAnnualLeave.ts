
import { useState, useEffect, useCallback } from 'react';
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
  const { company } = useCompany();

  // Function to fetch annual leave data
  const fetchLeaveData = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);

    try {
      // Format month for query: YYYY-MM
      const monthStr = format(month, 'yyyy-MM');

      // Fetch all leaves for the month
      // We use a raw query since the types don't know about the annual_leaves table yet
      const { data, error } = await supabase
        .rpc('get_annual_leaves', { 
          company_id_param: company.id,
          month_param: monthStr + '%'
        });

      if (error) {
        console.error('Error fetching leave data:', error);
        toast.error('Failed to load annual leave data');
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

      // Use a raw query to check if entry exists
      const { data: existingData, error: checkError } = await supabase
        .rpc('check_annual_leave_entry', {
          member_id_param: memberId,
          date_param: date,
          company_id_param: company.id
        });

      if (checkError) {
        console.error('Error checking leave entry:', checkError);
        throw checkError;
      }

      if (hours === 0 && existingData?.id) {
        // Delete entry if hours is zero and entry exists
        await supabase
          .rpc('delete_annual_leave', {
            leave_id_param: existingData.id
          });
      } else if (hours > 0) {
        if (existingData?.id) {
          // Update existing entry
          await supabase
            .rpc('update_annual_leave', {
              leave_id_param: existingData.id,
              hours_param: hours
            });
        } else {
          // Create new entry
          await supabase
            .rpc('create_annual_leave', {
              member_id_param: memberId,
              date_param: date,
              hours_param: hours,
              company_id_param: company.id
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

  // Fetch data when component mounts or month changes
  useEffect(() => {
    if (company?.id) {
      fetchLeaveData();
    }
  }, [company?.id, month, fetchLeaveData]);

  return {
    leaveData,
    isLoading,
    updateLeaveHours,
    refreshLeaveData: fetchLeaveData
  };
};
