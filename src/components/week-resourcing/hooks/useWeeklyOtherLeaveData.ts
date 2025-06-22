
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek } from 'date-fns';
import { useCompany } from '@/context/CompanyContext';

export const useWeeklyOtherLeaveData = (weekStartDate: string, memberIds: string[]) => {
  const [otherLeaveData, setOtherLeaveData] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    if (!company?.id || memberIds.length === 0) {
      setOtherLeaveData({});
      return;
    }

    const fetchOtherLeaveData = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('weekly_other_leave')
          .select('member_id, hours')
          .eq('company_id', company.id)
          .eq('week_start_date', weekStartDate)
          .in('member_id', memberIds);

        if (error) {
          console.error('Error fetching weekly other leave:', error);
          return;
        }

        const otherLeaveMap: Record<string, number> = {};
        data?.forEach(leave => {
          otherLeaveMap[leave.member_id] = (otherLeaveMap[leave.member_id] || 0) + (leave.hours || 0);
        });

        setOtherLeaveData(otherLeaveMap);
      } catch (error) {
        console.error('Error in fetchOtherLeaveData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOtherLeaveData();
  }, [company?.id, weekStartDate, memberIds]);

  const updateOtherLeave = async (memberId: string, hours: number, notes?: string) => {
    if (!company?.id) return false;

    try {
      // First, check if a record exists for this member and week
      const { data: existingData, error: selectError } = await supabase
        .from('weekly_other_leave')
        .select('id, hours')
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing other leave:', selectError);
        return false;
      }

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('weekly_other_leave')
          .update({ 
            hours: hours,
            notes: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);

        if (updateError) {
          console.error('Error updating other leave:', updateError);
          return false;
        }
      } else if (hours > 0) {
        // Create new record only if hours > 0
        const { error: insertError } = await supabase
          .from('weekly_other_leave')
          .insert({
            member_id: memberId,
            company_id: company.id,
            week_start_date: weekStartDate,
            hours: hours,
            leave_type: 'other',
            notes: notes
          });

        if (insertError) {
          console.error('Error inserting other leave:', insertError);
          return false;
        }
      }

      // Update local state
      setOtherLeaveData(prev => ({
        ...prev,
        [memberId]: hours
      }));

      return true;
    } catch (error) {
      console.error('Error in updateOtherLeave:', error);
      return false;
    }
  };

  return {
    otherLeaveData,
    isLoading,
    updateOtherLeave
  };
};
