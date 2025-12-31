import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { LeaveRequest } from '@/types/leave';
import { logger } from '@/utils/logger';

export const useLeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState<LeaveRequest[]>([]);
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const { company } = useCompany();

  const realtimeRefreshTimerRef = useRef<number | null>(null);
  const roleFlagsCache = useRef<{ userId: string; companyId: string; isAdminOrOwner: boolean; isLeaveAdmin: boolean } | null>(null);

  const getRoleFlags = useCallback(async (userId: string, companyId: string) => {
    // Return cached result if available for same user/company
    if (
      roleFlagsCache.current &&
      roleFlagsCache.current.userId === userId &&
      roleFlagsCache.current.companyId === companyId
    ) {
      return {
        isAdminOrOwner: roleFlagsCache.current.isAdminOrOwner,
        isLeaveAdmin: roleFlagsCache.current.isLeaveAdmin,
      };
    }

    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role, is_leave_admin')
      .eq('user_id', userId)
      .eq('company_id', companyId);

    if (error) {
      return { isAdminOrOwner: false, isLeaveAdmin: false };
    }

    const isAdminOrOwner = (roles ?? []).some(
      (r) => r.role === 'admin' || r.role === 'owner'
    );
    const isLeaveAdmin = (roles ?? []).some((r) => r.is_leave_admin === true);

    // Cache the result
    roleFlagsCache.current = { userId, companyId, isAdminOrOwner, isLeaveAdmin };

    return { isAdminOrOwner, isLeaveAdmin };
  }, []);

  const fetchPendingApprovals = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Run role flags query and leave requests query in PARALLEL
      const [roleFlags, leaveRequestsResult, directReportsResult] = await Promise.all([
        getRoleFlags(user.id, company.id),
        supabase
          .from('leave_requests')
          .select(`
            *,
            leave_type:leave_types(*),
            member:profiles!leave_requests_member_id_fkey(id, first_name, last_name, avatar_url, email),
            approver:profiles!leave_requests_approved_by_fkey(id, first_name, last_name),
            requested_approver:profiles!leave_requests_requested_approver_id_fkey(id, first_name, last_name)
          `)
          .eq('company_id', company.id)
          .or('status.is.null,status.neq.cancelled')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', user.id)
          .eq('company_id', company.id),
      ]);

      const { isAdminOrOwner, isLeaveAdmin } = roleFlags;
      const { data, error } = leaveRequestsResult;
      const { data: managedProfiles } = directReportsResult;

      // Update canApprove based on fetched data
      const isManager = (managedProfiles?.length ?? 0) > 0;
      setCanApprove(isAdminOrOwner || isLeaveAdmin || isManager);

      if (error) {
        logger.error('Error fetching leave requests:', error);
        toast.error('Failed to load leave requests');
        return;
      }

      // Filter based on permissions
      let filteredData = (data as LeaveRequest[]) || [];

      if (!isAdminOrOwner && !isLeaveAdmin) {
        const managedIds = managedProfiles?.map((p) => p.id) || [];

        filteredData = filteredData.filter((req) => {
          if (req.requested_approver_id === user.id) return true;
          if (managedIds.includes(req.member_id)) return true;
          return false;
        });
      }

      // Separate pending from processed
      const pending = filteredData.filter((req) => !req.status || req.status === 'pending');
      const all = filteredData;

      setPendingApprovals(pending);
      setAllRequests(all);
    } catch (error) {
      logger.error('Error in fetchPendingApprovals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, getRoleFlags]);

  const approveRequest = useCallback(async (requestId: string): Promise<boolean> => {
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      // First, get the leave request details
      const { data: request, error: fetchError } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (fetchError || !request) {
        logger.error('Error fetching request:', fetchError);
        toast.error('Failed to fetch request details');
        return false;
      }

      // Update the leave request status
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        logger.error('Error approving request:', error);
        toast.error('Failed to approve request');
        return false;
      }

      // Create entries in annual_leaves for each day of the leave
      // Parse dates as local dates to avoid timezone issues
      const [startYear, startMonth, startDay] = request.start_date.split('-').map(Number);
      const [endYear, endMonth, endDay] = request.end_date.split('-').map(Number);
      const startDate = new Date(startYear, startMonth - 1, startDay);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      const hoursPerDay = request.duration_type === 'full_day' ? 8 : 4;
      
      const leaveEntries = [];
      const currentDate = new Date(startDate);
      
      logger.log('Creating leave entries from', request.start_date, 'to', request.end_date);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Format date as YYYY-MM-DD without timezone issues
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          logger.log('Adding leave entry for date:', dateStr);
          
          leaveEntries.push({
            member_id: request.member_id,
            date: dateStr,
            hours: hoursPerDay,
            company_id: request.company_id,
            leave_request_id: requestId,
            leave_type_id: request.leave_type_id
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (leaveEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('annual_leaves')
          .insert(leaveEntries);

        if (insertError) {
          logger.error('Error creating leave entries:', insertError);
          // Don't fail the approval, just log the error
        }
      }

      toast.success('Leave request approved');
      await fetchPendingApprovals();
      return true;
    } catch (error) {
      logger.error('Error in approveRequest:', error);
      toast.error('Failed to approve request');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingApprovals]);

  const rejectRequest = useCallback(async (
    requestId: string, 
    reason: string
  ): Promise<boolean> => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return false;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        logger.error('Error rejecting request:', error);
        toast.error('Failed to reject request');
        return false;
      }

      toast.success('Leave request rejected');
      await fetchPendingApprovals();
      return true;
    } catch (error) {
      logger.error('Error in rejectRequest:', error);
      toast.error('Failed to reject request');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingApprovals]);

  const reassignApprover = useCallback(async (
    requestId: string,
    newApproverId: string
  ): Promise<boolean> => {
    if (!newApproverId) {
      toast.error('Please select a new approver');
      return false;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      const { error } = await supabase
        .from('leave_requests')
        .update({
          requested_approver_id: newApproverId
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (error) {
        logger.error('Error reassigning approver:', error);
        toast.error('Failed to reassign approver');
        return false;
      }

      toast.success('Approver reassigned successfully');
      await fetchPendingApprovals();
      return true;
    } catch (error) {
      logger.error('Error in reassignApprover:', error);
      toast.error('Failed to reassign approver');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingApprovals]);

  useEffect(() => {
    if (company?.id) {
      fetchPendingApprovals();
    }
  }, [company?.id, fetchPendingApprovals]);

  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`leave-requests-approvals:${company.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leave_requests',
          filter: `company_id=eq.${company.id}`,
        },
        () => {
          if (realtimeRefreshTimerRef.current) {
            window.clearTimeout(realtimeRefreshTimerRef.current);
          }
          realtimeRefreshTimerRef.current = window.setTimeout(() => {
            fetchPendingApprovals();
          }, 250);
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
  }, [company?.id, fetchPendingApprovals]);

  return {
    pendingApprovals,
    allRequests,
    isLoading,
    isProcessing,
    canApprove,
    approveRequest,
    rejectRequest,
    reassignApprover,
    refreshApprovals: fetchPendingApprovals
  };
};
