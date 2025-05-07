
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
      
      // Query the profiles table to check if user is admin or owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      const canManage = profileData?.role === 'admin' || profileData?.role === 'owner';
      
      if (!canManage) {
        console.error('Insufficient permissions');
        toast.error('You do not have permission to manage team members');
        return false;
      }
      
      // Get user profile for logging purposes
      const { data: userProfile, error: profileDataError } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', data.user.id)
        .single();
        
      if (profileDataError) {
        console.error('Error fetching user profile:', profileDataError);
        // Don't return false here since we already verified permissions
      }
      
      if (userProfile) {
        console.log('Current user role:', userProfile.role);
        console.log('Current user company ID:', userProfile.company_id);
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
