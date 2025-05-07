
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
      console.log('Checking user permissions...');
      
      // Get user session to check permissions
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        return false;
      }
      
      if (!sessionData?.session?.user) {
        console.error('No active session found');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      console.log('Current user ID:', userId);
      
      // Query the profiles table directly to get the user's role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error checking user profile:', profileError.message);
        return false;
      }
      
      if (!profileData) {
        console.error('No profile found for user');
        return false;
      }
      
      console.log('User profile found:', profileData);
      
      // Check if the user is an admin or owner
      const role = profileData.role;
      console.log('User role:', role);
      
      const canManage = role === 'admin' || role === 'owner';
      console.log('Can user manage team members?', canManage);
      
      if (!canManage) {
        console.warn('User does not have sufficient permissions');
      }
      
      return canManage;
    } catch (error: any) {
      console.error('Error checking permissions:', error.message);
      return false;
    }
  };

  return {
    checkUserPermissions
  };
};
