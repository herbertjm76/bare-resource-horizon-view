
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/components/dashboard/types';
import { Database } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

type AppRole = Database['public']['Enums']['app_role'];

export const useActiveMemberService = (companyId: string | undefined) => {
  const updateActiveMember = async (memberData: Partial<Profile>): Promise<boolean> => {
    if (!companyId || !memberData.id) {
      logger.error('Company ID and member ID are required');
      return false;
    }

    try {
      logger.log('Updating active member:', memberData.id, memberData);

      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          department: memberData.department,
          location: memberData.location,
          job_title: memberData.job_title,
          weekly_capacity: memberData.weekly_capacity,
          avatar_url: memberData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberData.id)
        .eq('company_id', companyId);

      if (error) {
        logger.error('Error updating active member:', error);
        throw error;
      }

      // Update role in user_roles table if role is provided
      // Use UPSERT to prevent role loss (never delete-then-insert)
      if (memberData.role) {
        logger.log('Updating user role to:', memberData.role);
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: memberData.id,
            role: memberData.role as AppRole,
            company_id: companyId
          }, { 
            onConflict: 'user_id,company_id' 
          });

        if (roleError) {
          logger.error('Error updating user role:', roleError);
          // Don't throw, just log - profile update was successful
        }
      }

      toast.success('Team member updated successfully');
      return true;
    } catch (error: any) {
      logger.error('Error in updateActiveMember:', error);
      toast.error(error.message || 'Failed to update team member');
      return false;
    }
  };

  const deleteActiveMember = async (memberId: string): Promise<boolean> => {
    if (!companyId) {
      logger.error('Company ID is required');
      return false;
    }

    try {
      // Delete user roles first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId)
        .eq('company_id', companyId);

      // Delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId)
        .eq('company_id', companyId);

      if (error) {
        logger.error('Error deleting active member:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      logger.error('Error in deleteActiveMember:', error);
      throw error;
    }
  };

  return {
    updateActiveMember,
    deleteActiveMember
  };
};
