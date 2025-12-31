import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { toast } from 'sonner';
import { LeaveRequest, LeaveFormData } from '@/types/leave';
import { differenceInBusinessDays, eachDayOfInterval, isWeekend, format } from 'date-fns';
import { logger } from '@/utils/logger';

export const useLeaveRequests = (memberId?: string) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companyId } = useCompanyId();

  const fetchLeaveRequests = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);

    try {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          leave_type:leave_types(*),
          member:profiles!leave_requests_member_id_fkey(id, first_name, last_name, avatar_url, email),
          approver:profiles!leave_requests_approved_by_fkey(id, first_name, last_name),
          requested_approver:profiles!leave_requests_requested_approver_id_fkey(id, first_name, last_name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (memberId) {
        query = query.eq('member_id', memberId);
      }

      // Exclude cancelled requests - they should be deleted but filter as safety measure
      query = query.neq('status', 'cancelled');

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching leave requests:', error);
        toast.error('Failed to load leave requests');
        return;
      }

      setLeaveRequests(data as LeaveRequest[] || []);
    } catch (error) {
      logger.error('Error in fetchLeaveRequests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, memberId]);

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
      logger.error('Error uploading attachment:', uploadError);
      throw new Error('Failed to upload attachment');
    }

    const { data } = supabase.storage
      .from('leave-attachments')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submitLeaveRequest = useCallback(async (
    formData: LeaveFormData,
    onBehalfOfMemberId?: string
  ): Promise<boolean> => {
    if (!companyId) return false;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to submit a leave request');
        return false;
      }

      // Use the provided member ID if admin is applying on behalf, otherwise use current user
      const targetMemberId = onBehalfOfMemberId || user.id;

      // Validate that the requested approver exists in profiles (not a pending invite)
      let validApproverId: string | null = null;
      if (formData.requested_approver_id) {
        const { data: approverProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', formData.requested_approver_id)
          .maybeSingle();
        
        if (approverProfile) {
          validApproverId = approverProfile.id;
        } else {
          logger.warn('Selected approver is not a valid profile, submitting without approver');
        }
      }

      let attachmentUrl: string | null = null;
      if (formData.attachment) {
        attachmentUrl = await uploadAttachment(formData.attachment, targetMemberId);
      }

      const totalHours = calculateTotalHours(
        formData.start_date,
        formData.end_date,
        formData.duration_type
      );

      const { error } = await supabase
        .from('leave_requests')
        .insert({
          company_id: companyId,
          member_id: targetMemberId,
          leave_type_id: formData.leave_type_id,
          duration_type: formData.duration_type,
          start_date: format(formData.start_date, 'yyyy-MM-dd'),
          end_date: format(formData.end_date, 'yyyy-MM-dd'),
          total_hours: totalHours,
          remarks: formData.remarks,
          manager_confirmed: formData.manager_confirmed,
          requested_approver_id: validApproverId,
          attachment_url: attachmentUrl,
          status: 'pending'
        });

      if (error) {
        logger.error('Error submitting leave request:', error);
        toast.error('Failed to submit leave request');
        return false;
      }

      const successMessage = onBehalfOfMemberId 
        ? 'Leave request submitted on behalf of team member'
        : 'Leave request submitted successfully';
      toast.success(successMessage);
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      logger.error('Error in submitLeaveRequest:', error);
      toast.error('Failed to submit leave request');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, fetchLeaveRequests]);

  const cancelLeaveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .delete()
        .eq('id', requestId)
        .eq('status', 'pending'); // Only allow deleting pending requests

      if (error) {
        logger.error('Error cancelling leave request:', error);
        toast.error('Failed to cancel leave request');
        return false;
      }

      toast.success('Leave request cancelled');
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      logger.error('Error in cancelLeaveRequest:', error);
      toast.error('Failed to cancel leave request');
      return false;
    }
  }, [fetchLeaveRequests]);

  const updateLeaveRequest = useCallback(async (
    requestId: string,
    formData: Omit<LeaveFormData, 'manager_confirmed'>,
    isAdminEdit: boolean = false
  ): Promise<boolean> => {
    if (!companyId) return false;

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

      // Validate that the requested approver exists in profiles
      let validApproverId: string | null = null;
      if (formData.requested_approver_id) {
        const { data: approverProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', formData.requested_approver_id)
          .maybeSingle();
        
        if (approverProfile) {
          validApproverId = approverProfile.id;
        }
      }

      const updateData: Record<string, any> = {
        leave_type_id: formData.leave_type_id,
        duration_type: formData.duration_type,
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        end_date: format(formData.end_date, 'yyyy-MM-dd'),
        total_hours: totalHours,
        remarks: formData.remarks,
        requested_approver_id: validApproverId
      };

      if (attachmentUrl) {
        updateData.attachment_url = attachmentUrl;
      }

      // Admin can edit any request, regular users only pending
      let query = supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId);
      
      if (!isAdminEdit) {
        query = query.eq('status', 'pending');
      }

      const { error } = await query;

      if (error) {
        logger.error('Error updating leave request:', error);
        toast.error('Failed to update leave request');
        return false;
      }

      toast.success('Leave request updated successfully');
      await fetchLeaveRequests();
      return true;
    } catch (error) {
      logger.error('Error in updateLeaveRequest:', error);
      toast.error('Failed to update leave request');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [companyId, fetchLeaveRequests]);

  useEffect(() => {
    if (companyId) {
      fetchLeaveRequests();
    }
  }, [companyId, fetchLeaveRequests]);

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
