import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { LeaveRequest } from '@/types/leave';

export const useLeaveApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState<LeaveRequest[]>([]);
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const { company } = useCompany();

  const checkApprovalPermissions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !company?.id) {
        setCanApprove(false);
        return;
      }

      // Check if user is admin, owner, or leave admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, is_leave_admin')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .single();

      const isAdminOrOwner = roleData?.role === 'admin' || roleData?.role === 'owner';
      const isLeaveAdmin = roleData?.is_leave_admin === true;

      // Check if user is a manager of any team members
      const { data: directReports } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', user.id)
        .eq('company_id', company.id);

      const isManager = (directReports?.length ?? 0) > 0;

      setCanApprove(isAdminOrOwner || isLeaveAdmin || isManager);
    } catch (error) {
      console.error('Error checking approval permissions:', error);
      setCanApprove(false);
    }
  }, [company?.id]);

  const fetchPendingApprovals = useCallback(async () => {
    if (!company?.id) return;

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check user permissions
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, is_leave_admin')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .maybeSingle();

      const isAdminOrOwner = roleData?.role === 'admin' || roleData?.role === 'owner';
      const isLeaveAdmin = roleData?.is_leave_admin === true;

      // Build the query
      // Admin/Owner/Leave admin should be able to see ALL requests (including their own)
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          leave_type:leave_types(*),
          member:profiles!leave_requests_member_id_fkey(id, first_name, last_name, avatar_url, email),
          approver:profiles!leave_requests_approved_by_fkey(id, first_name, last_name),
          requested_approver:profiles!leave_requests_requested_approver_id_fkey(id, first_name, last_name)
        `)
        .eq('company_id', company.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leave requests:', error);
        toast.error('Failed to load leave requests');
        return;
      }

      // Filter based on permissions
      let filteredData = data as LeaveRequest[] || [];

      if (!isAdminOrOwner && !isLeaveAdmin) {
        // Non-admins can see:
        // 1. Requests where they are the assigned approver (requested_approver_id)
        // 2. Requests from their direct reports (if they are a manager)
        const { data: managedProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', user.id)
          .eq('company_id', company.id);
        
        const managedIds = managedProfiles?.map(p => p.id) || [];
        
        filteredData = filteredData.filter((req) => {
          // Show if user is the assigned approver
          if (req.requested_approver_id === user.id) return true;
          // Show if user is the manager of the requester
          if (managedIds.includes(req.member_id)) return true;
          return false;
        });
      }

      // Separate pending from processed
      const pending = filteredData.filter(req => req.status === 'pending');
      const all = filteredData;

      setPendingApprovals(pending);
      setAllRequests(all);
    } catch (error) {
      console.error('Error in fetchPendingApprovals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);

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
        console.error('Error fetching request:', fetchError);
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
        console.error('Error approving request:', error);
        toast.error('Failed to approve request');
        return false;
      }

      // Create entries in annual_leaves for each day of the leave
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      const hoursPerDay = request.duration_type === 'full_day' ? 8 : 4;
      
      const leaveEntries = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          leaveEntries.push({
            member_id: request.member_id,
            date: currentDate.toISOString().split('T')[0],
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
          console.error('Error creating leave entries:', insertError);
          // Don't fail the approval, just log the error
        }
      }

      toast.success('Leave request approved');
      await fetchPendingApprovals();
      return true;
    } catch (error) {
      console.error('Error in approveRequest:', error);
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
        console.error('Error rejecting request:', error);
        toast.error('Failed to reject request');
        return false;
      }

      toast.success('Leave request rejected');
      await fetchPendingApprovals();
      return true;
    } catch (error) {
      console.error('Error in rejectRequest:', error);
      toast.error('Failed to reject request');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [fetchPendingApprovals]);

  useEffect(() => {
    if (company?.id) {
      checkApprovalPermissions();
      fetchPendingApprovals();
    }
  }, [company?.id, checkApprovalPermissions, fetchPendingApprovals]);

  return {
    pendingApprovals,
    allRequests,
    isLoading,
    isProcessing,
    canApprove,
    approveRequest,
    rejectRequest,
    refreshApprovals: fetchPendingApprovals
  };
};
