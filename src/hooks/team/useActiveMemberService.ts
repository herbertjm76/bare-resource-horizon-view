
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/components/dashboard/types';

export const useActiveMemberService = (companyId: string | undefined) => {
  const updateActiveMember = async (memberData: Partial<Profile>): Promise<boolean> => {
    if (!companyId || !memberData.id) {
      console.error('Company ID and member ID are required');
      return false;
    }

    try {
      console.log('Updating active member:', memberData.id, memberData);

      // Only update the profiles table, never touch auth.users
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          role: memberData.role,
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
        console.error('Error updating active member:', error);
        throw error;
      }

      toast.success('Team member updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error in updateActiveMember:', error);
      toast.error(error.message || 'Failed to update team member');
      return false;
    }
  };

  const deleteActiveMember = async (memberId: string): Promise<boolean> => {
    if (!companyId) {
      console.error('Company ID is required');
      return false;
    }

    try {
      // Only delete from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', memberId)
        .eq('company_id', companyId);

      if (error) {
        console.error('Error deleting active member:', error);
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error in deleteActiveMember:', error);
      throw error;
    }
  };

  return {
    updateActiveMember,
    deleteActiveMember
  };
};
