
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session found');
        toast.error('You must be logged in to manage team members');
        return false;
      }
      
      console.log('Current user ID:', session.user.id);
      
      // Check user permissions
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      console.log('Current user role:', userProfile?.role);
      
      // Only owners and admins can manage team members
      if (!userProfile || (userProfile.role !== 'owner' && userProfile.role !== 'admin')) {
        console.error('Insufficient permissions, user role:', userProfile?.role);
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
