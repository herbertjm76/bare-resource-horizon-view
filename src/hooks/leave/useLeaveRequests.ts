import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { LeaveRequest, LeaveFormData } from '@/types/leave';
import { differenceInBusinessDays, eachDayOfInterval, isWeekend } from 'date-fns';

export const useLeaveRequests = (memberId?: string) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { company } = useCompany();

  const fetchLeaveRequests = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);

    try {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          leave_type:leave_types(*),
          member:profiles!leave_requests_member_id_fkey(id, first_name, last_name, avatar_url, email),
          approver:profiles!leave_requests_approved_by_fkey(id, first_name, last_name)
        `)
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (memberId) {
        query = query.eq('member_id', memberId);
      }

      // Exclude cancelled requests - they should be deleted but filter as safety measure
      query = query.neq('status', 'cancelled');

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to load leave requests');
        return;
      }

      setLeaveRequests(data as LeaveRequest[] || []);
    } catch (error) {
      console.error('Error in fetchLeaveRequests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, memberId]);

  const calculateTotalHours = (
    startDate: Date,
    endDate: Date,
    durationType: 'full_day' | 'half_day_am' | 'half_day_pm'
  ): number => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const workingDays = days.filter(day => !isWeekend(day));
    
    if (durationType === 'full_day') {
      return workingDays.length * 8;
    }
    // Half day
    return workingDays.length * 4;
  };

  const uploadAttachment = async (file: File, memberId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${memberId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('leave-attachments')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading attachment:', uploadError);
      throw new Error('Failed to upload attachment');
    }

    const { data } = supabase.storage
      .from('leave-attachments')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submitLeaveRequest = useCallback(async (formData: LeaveFormData): Promise<boolean> => {
    if (!company?.id) return false;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to submit a leave request');
        return false;
      }

      let attachmentUrl: string | null = null;
      if (formData.attachment) {
        attachmentUrl = await uploadAttachment(formData.attachment, user.id);
      }

      const totalHours = calculateTotalHours(
        formData.start_date,
        formData.end_date,
        formData.duration_type
      );

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          company_id: company.id,
          member_id: user.id,
          leave_type_id: formData.leave_type_id,
          duration_type: formData.duration_type,
          start_date: formData.start_date.toISOString().split('T')[0],
          end_date: formData.end_date.toISOString().split('T')[0],
          total_hours: totalHours,
          remarks: formData.remarks,
          manager_confirmed: formData.manager_confirmed,
          requested_approver_id: formData.requested_approver_id || null,
          attachment_url: attachmentUrl,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting leave request:', error);
        toast.error('Failed to submit leave request');
        return false;
      }

      toast.success('Leave request submitted successfully');
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      console.error('Error in submitLeaveRequest:', error);
      toast.error('Failed to submit leave request');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [company?.id, fetchLeaveRequests]);

  const cancelLeaveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .delete()
        .eq('id', requestId)
        .eq('status', 'pending'); // Only allow deleting pending requests

      if (error) {
        console.error('Error cancelling leave request:', error);
        toast.error('Failed to cancel leave request');
        return false;
      }

      toast.success('Leave request cancelled');
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      console.error('Error in cancelLeaveRequest:', error);
      toast.error('Failed to cancel leave request');
      return false;
    }
  }, [fetchLeaveRequests]);

  const updateLeaveRequest = useCallback(async (
    requestId: string,
    formData: Omit<LeaveFormData, 'manager_confirmed'>
  ): Promise<boolean> => {
    if (!company?.id) return false;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      let attachmentUrl: string | null = null;
      if (formData.attachment) {
        attachmentUrl = await uploadAttachment(formData.attachment, user.id);
      }

      const totalHours = calculateTotalHours(
        formData.start_date,
        formData.end_date,
        formData.duration_type
      );

      const updateData: Record<string, any> = {
        leave_type_id: formData.leave_type_id,
        duration_type: formData.duration_type,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0],
        total_hours: totalHours,
        remarks: formData.remarks,
        requested_approver_id: formData.requested_approver_id || null
      };

      if (attachmentUrl) {
        updateData.attachment_url = attachmentUrl;
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId)
        .eq('status', 'pending'); // Only allow updating pending requests

      if (error) {
        console.error('Error updating leave request:', error);
        toast.error('Failed to update leave request');
        return false;
      }

      toast.success('Leave request updated successfully');
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      console.error('Error in updateLeaveRequest:', error);
      toast.error('Failed to update leave request');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [company?.id, fetchLeaveRequests]);

  useEffect(() => {
    if (company?.id) {
      fetchLeaveRequests();
    }
  }, [company?.id, fetchLeaveRequests]);

  return {
    leaveRequests,
    isLoading,
    isSubmitting,
    submitLeaveRequest,
    cancelLeaveRequest,
    updateLeaveRequest,
    refreshLeaveRequests: fetchLeaveRequests
  };
};
