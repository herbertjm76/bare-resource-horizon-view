
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';

/**
 * Hook to check if a user has permissions to manage team members
 */
export const useMemberPermissions = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  /**
   * Checks if the current user has permission to manage team members
   */
  const checkUserPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      setPermissionError(null);
      
      console.log('Checking user permissions...');
      
      // Get user session to check permissions
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        setPermissionError('Error fetching session');
        setHasPermission(false);
        return { hasPermission: false, error: sessionError.message };
      }
      
      if (!sessionData?.session?.user) {
        console.error('No active session found');
        setPermissionError('No active session');
        setHasPermission(false);
        return { hasPermission: false, error: 'No active session found' };
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
        setPermissionError(profileError.message);
        setHasPermission(false);
        return { hasPermission: false, error: `Error checking user profile: ${profileError.message}` };
      }
      
      if (!profileData) {
        console.error('No profile found for user');
        setPermissionError('No profile found');
        setHasPermission(false);
        return { hasPermission: false, error: 'No profile found for user' };
      }
      
      console.log('User profile found:', profileData);
      
      // Check if the user is an admin or owner
      const role = profileData.role;
      console.log('User role:', role);
      
      const canManage = role === 'admin' || role === 'owner';
      console.log('Can user manage team members?', canManage);
      
      setHasPermission(canManage);
      
      if (!canManage) {
        console.warn('User does not have sufficient permissions');
        setPermissionError('Insufficient permissions');
        return { hasPermission: false, error: 'User does not have sufficient permissions' };
      }
      
      return { hasPermission: true, error: null };
    } catch (error: any) {
      console.error('Error checking permissions:', error.message);
      setPermissionError(`Error: ${error.message}`);
      setHasPermission(false);
      return { hasPermission: false, error: error.message };
    } finally {
      setIsChecking(false);
    }
  }, []);

  return {
    checkUserPermissions,
    isChecking,
    hasPermission,
    permissionError
  };
};
