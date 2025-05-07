
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to check if a user has permissions to manage team members
 */
export const useMemberPermissions = () => {
  /**
   * Checks if the current user has permission to manage team members
   * @returns {Promise<boolean>} True if the user has permission, false otherwise
   */
  const checkUserPermissions = async () => {
    try {
      // Get user session to check permissions
      const { data } = await supabase.auth.getUser();
      if (!data || !data.user) {
        console.error('No active session found');
        toast.error('You must be logged in to manage team members');
        return false;
      }
      
      console.log('Current user ID:', data.user.id);
      
      // Get user profile using the RPC function
      const { data: userProfile, error: profileError } = await supabase
        .rpc('get_user_profile_by_id', { user_id: data.user.id });
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      if (!userProfile) {
        console.error('User profile not found');
        toast.error('User profile not found');
        return false;
      }
      
      console.log('Current user role:', userProfile.role);
      console.log('Current user company ID:', userProfile.company_id);
      
      // Only owners and admins can manage team members
      if (userProfile.role !== 'owner' && userProfile.role !== 'admin') {
        console.error('Insufficient permissions, user role:', userProfile.role);
        toast.error('You do not have permission to manage team members');
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Error checking permissions:', error);
      toast.error('Failed to verify permissions');
      return false;
    }
  };

  return {
    checkUserPermissions
  };
};
