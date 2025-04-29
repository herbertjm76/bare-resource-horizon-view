
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PendingMember } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { useMemberPermissions } from './useMemberPermissions';

/**
 * Service for managing pending team members in the invites table
 */
export const usePendingMemberService = (companyId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkUserPermissions } = useMemberPermissions();

  /**
   * Update a pending member (pre-registered)
   */
  const updatePendingMember = async (memberData: Partial<PendingMember>) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const hasPermission = await checkUserPermissions();
      if (!hasPermission) return false;

      console.log('Updating pre-registered member in invites table:', memberData);
      
      // Extract only the fields we need to update
      const updateData = {
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        email: memberData.email,
        role: memberData.role,
        department: memberData.department,
        location: memberData.location,
        job_title: memberData.job_title
      };
      
      console.log('Update data being sent to invites table:', updateData);
      
      const { error } = await supabase
        .from('invites')
        .update(updateData)
        .eq('id', memberData.id)
        .eq('company_id', companyId);  // Add company_id check for security

      if (error) {
        console.error('Error updating pre-registered member:', error);
        toast.error(`Failed to update member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully updated pre-registered member');
      toast.success('Pre-registered member updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating pending member:', error);
      toast.error(error.message || 'Failed to update team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new pending member (pre-registered)
   */
  const createPendingMember = async (memberData: Partial<PendingMember>) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const hasPermission = await checkUserPermissions();
      if (!hasPermission) return false;

      // Get current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to invite team members');
        return false;
      }
      
      // Create new pre-registered member in invites table
      console.log('Creating new pre-registered member in invites table');
      const { error } = await supabase
        .from('invites')
        .insert({
          email: memberData.email,
          company_id: companyId,
          code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          created_by: session.user.id,
          invitation_type: 'pre_registered',
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          department: memberData.department,
          location: memberData.location,
          job_title: memberData.job_title,
          role: memberData.role
        });

      if (error) {
        console.error('Error creating pre-registered member:', error);
        toast.error(`Failed to create member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully created pre-registered member');
      toast.success('Pre-registered new team member');
      return true;
    } catch (error: any) {
      console.error('Error creating pending member:', error);
      toast.error(error.message || 'Failed to create team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a pending member
   */
  const deletePendingMember = async (memberId: string) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const hasPermission = await checkUserPermissions();
      if (!hasPermission) return false;
      
      console.log('Deleting pending member from invites table:', memberId);
      // Delete from invites table
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', memberId)
        .eq('company_id', companyId); // Add company_id check for security
        
      if (error) {
        console.error('Error deleting from invites:', error);
        toast.error(`Failed to delete member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully deleted from invites table');
      return true;
    } catch (error: any) {
      console.error('Error deleting pending member:', error);
      toast.error(error.message || 'Failed to delete team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePendingMember,
    createPendingMember,
    deletePendingMember,
    isLoading
  };
};
