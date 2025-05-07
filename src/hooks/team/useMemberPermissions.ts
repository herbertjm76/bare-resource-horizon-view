
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please try logging in again.');
        return false;
      }
      
      if (!sessionData?.session?.user) {
        console.error('No active session found');
        toast.error('You must be logged in to manage team members');
        return false;
      }
      
      const userId = sessionData.session.user.id;
      console.log('Current user ID:', userId);
      
      // Query the profiles table to check if user is admin or owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      if (!profileData) {
        console.error('No profile found');
        toast.error('User profile not found');
        return false;
      }
      
      console.log('User profile data:', profileData);
      const canManage = profileData.role === 'admin' || profileData.role === 'owner';
      
      if (!canManage) {
        console.warn('Insufficient permissions, role:', profileData.role);
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
