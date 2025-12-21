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
        .single();

      const isAdminOrOwner = roleData?.role === 'admin' || roleData?.role === 'owner';
      const isLeaveAdmin = roleData?.is_leave_admin === true;

      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          leave_type:leave_types(*),
          member:profiles!leave_requests_member_id_fkey(id, first_name, last_name, avatar_url, email),
          approver:profiles!leave_requests_approved_by_fkey(id, first_name, last_name)
        `)
        .eq('company_id', company.id)
        .neq('member_id', user.id) // Exclude own requests
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
        // Manager can only see their direct reports' requests
        // We need to fetch manager_id separately
        const { data: managedProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', user.id)
          .eq('company_id', company.id);
        
        const managedIds = managedProfiles?.map(p => p.id) || [];
        filteredData = filteredData.filter(
          (req) => managedIds.includes(req.member_id)
        );
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
