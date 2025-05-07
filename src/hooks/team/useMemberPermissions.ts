
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
      
      // Get user session to check permissions - use simpler session check
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session?.user) {
        console.error('No active session found');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      console.log('Current user ID:', userId);
      
      // Query the profiles table directly with better error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        return false;
      }
      
      if (!profileData) {
        console.error('No profile found');
        return false;
      }
      
      console.log('User profile data:', profileData);
      const canManage = profileData.role === 'admin' || profileData.role === 'owner';
      
      if (!canManage) {
        console.warn('Insufficient permissions, role:', profileData.role);
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  return {
    checkUserPermissions
  };
};
