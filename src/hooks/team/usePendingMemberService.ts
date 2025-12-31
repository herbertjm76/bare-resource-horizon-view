
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PendingMember } from '@/components/dashboard/types';
import { logger } from '@/utils/logger';

export const usePendingMemberService = (companyId: string | undefined) => {
  const updatePendingMember = async (memberData: Partial<PendingMember>): Promise<boolean> => {
    if (!companyId || !memberData.id) {
      logger.error('Company ID and member ID are required');
      return false;
    }

    try {
      logger.log('Updating pending member:', memberData.id, memberData);

      // Only update the invites table, never touch auth.users
      const { error } = await supabase
        .from('invites')
        .update({
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          role: memberData.role,
          department: memberData.department,
          location: memberData.location,
          job_title: memberData.job_title,
          weekly_capacity: memberData.weekly_capacity,
          practice_area: memberData.practice_area,
          avatar_url: memberData.avatar_url
        })
        .eq('id', memberData.id)
        .eq('company_id', companyId);

      if (error) {
        logger.error('Error updating pending member:', error);
        throw error;
      }

      toast.success('Pre-registered member updated successfully');
      return true;
    } catch (error: any) {
      logger.error('Error in updatePendingMember:', error);
      toast.error(error.message || 'Failed to update pre-registered member');
      return false;
    }
  };

  const createPendingMember = async (memberData: Partial<PendingMember>): Promise<boolean> => {
    if (!companyId) {
      logger.error('Company ID is required');
      return false;
    }

    try {
      logger.log('Creating pending member:', memberData);

      // Get current user session to get the user ID
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user) {
        logger.error('Error getting current user session:', sessionError);
        toast.error('Authentication required to create pre-registered member');
        return false;
      }

      const currentUserId = sessionData.session.user.id;

      const { error } = await supabase
        .from('invites')
        .insert({
          company_id: companyId,
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          role: memberData.role,
          department: memberData.department,
          location: memberData.location,
          job_title: memberData.job_title,
          weekly_capacity: memberData.weekly_capacity || 40,
          practice_area: memberData.practice_area,
          avatar_url: memberData.avatar_url,
          invitation_type: 'pre_registered',
          status: 'pending',
          code: Math.random().toString(36).substring(2, 15),
          created_by: currentUserId // Use the ID from session
        });

      if (error) {
        logger.error('Error creating pending member:', error);
        throw error;
      }

      toast.success('Pre-registered member created successfully');
      return true;
    } catch (error: any) {
      logger.error('Error in createPendingMember:', error);
      toast.error(error.message || 'Failed to create pre-registered member');
      return false;
    }
  };

  const deletePendingMember = async (memberId: string): Promise<boolean> => {
    if (!companyId) {
      logger.error('Company ID is required');
      return false;
    }

    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', memberId)
        .eq('company_id', companyId);

      if (error) {
        logger.error('Error deleting pending member:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      logger.error('Error in deletePendingMember:', error);
      throw error;
    }
  };

  return {
    updatePendingMember,
    createPendingMember,
    deletePendingMember
  };
};
