
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
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('*')
        .eq('company_id', company.id)
        .like('date', `${monthStr}%`);

      if (error) {
        console.error('Error fetching leave data:', error);
        toast.error('Failed to load annual leave data');
        return;
      }

      // Transform data into nested structure by member_id and date
      const formattedData: Record<string, Record<string, number>> = {};
      
      data?.forEach((leave: LeaveEntry) => {
        if (!formattedData[leave.member_id]) {
          formattedData[leave.member_id] = {};
        }
        formattedData[leave.member_id][leave.date] = leave.hours;
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

      // Check if entry exists
      const { data: existingData } = await supabase
        .from('annual_leaves')
        .select('id')
        .eq('member_id', memberId)
        .eq('date', date)
        .eq('company_id', company.id)
        .single();

      if (hours === 0 && existingData?.id) {
        // Delete entry if hours is zero and entry exists
        await supabase
          .from('annual_leaves')
          .delete()
          .eq('id', existingData.id);
      } else if (hours > 0) {
        if (existingData?.id) {
          // Update existing entry
          await supabase
            .from('annual_leaves')
            .update({ hours })
            .eq('id', existingData.id);
        } else {
          // Create new entry
          await supabase
            .from('annual_leaves')
            .insert({
              member_id: memberId,
              date,
              hours,
              company_id: company.id
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
