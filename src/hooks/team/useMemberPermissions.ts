
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
      
      // Use secure RPC functions to check if user can manage company members
      const { data: canManage, error: managementError } = await supabase
        .rpc('user_can_manage_company', { user_id: data.user.id });
        
      if (managementError) {
        console.error('Error checking user permissions:', managementError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      if (!canManage) {
        console.error('Insufficient permissions');
        toast.error('You do not have permission to manage team members');
        return false;
      }
      
      // Get user profile for logging purposes
      const { data: userProfile, error: profileError } = await supabase
        .rpc('get_user_profile_by_id', { user_id: data.user.id });
        
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Don't return false here since we already verified permissions with the RPC
      }
      
      if (userProfile && userProfile.length > 0) {
        const profile = Array.isArray(userProfile) ? userProfile[0] : userProfile;
        console.log('Current user role:', profile.role);
        console.log('Current user company ID:', profile.company_id);
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
