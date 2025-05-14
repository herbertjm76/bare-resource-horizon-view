
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { useMemberPermissions } from './useMemberPermissions';

// Define the user role type based on the database enum
type UserRole = Database['public']['Enums']['user_role'];

/**
 * Service for managing active team members in the profiles table
 */
export const useActiveMemberService = (companyId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const { checkUserPermissions } = useMemberPermissions();

  /**
   * Update an existing active team member
   */
  const updateActiveMember = async (memberData: Partial<Profile>) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);

      // Check user permissions
      const hasPermission = await checkUserPermissions();
      if (!hasPermission) return false;

      console.log('Updating active member in profiles table:', memberData);
      
      // Extract only the fields we need to update in the profiles table
      const updateData = {
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        department: memberData.department,
        location: memberData.location,
        job_title: memberData.job_title,
        weekly_capacity: memberData.weekly_capacity,
        role: memberData.role as UserRole, // Cast to ensure correct type
        updated_at: new Date().toISOString()
      };
      
      // IMPORTANT: Do not update email in the profiles table as this would cause
      // inconsistency with the auth.users table that we cannot directly update
      
      console.log('Update data being sent to profiles table:', updateData);
      console.log('User ID for update:', memberData.id);
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', memberData.id)
        .eq('company_id', companyId);  // Add company_id check for security

      if (error) {
        console.error('Error updating active member:', error);
        toast.error(`Failed to update member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully updated active member');
      toast.success('Team member updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating active member:', error);
      toast.error(error.message || 'Failed to update team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an active team member
   */
  const deleteActiveMember = async (memberId: string) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Check user permissions
      const hasPermission = await checkUserPermissions();
      if (!hasPermission) return false;
      
      console.log('Deleting active member from profiles table:', memberId);
      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId)
        .eq('company_id', companyId); // Add company_id check for security
        
      if (error) {
        console.error('Error deleting from profiles:', error);
        toast.error(`Failed to delete member: ${error.message}`);
        return false;
      }
      
      console.log('Successfully deleted from profiles table');
      return true;
    } catch (error: any) {
      console.error('Error deleting active member:', error);
      toast.error(error.message || 'Failed to delete team member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateActiveMember,
    deleteActiveMember,
    isLoading
  };
};
