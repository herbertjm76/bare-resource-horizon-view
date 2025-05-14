
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
   * Uses session metadata to avoid potential RLS policy recursion issues
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
      
      // Extract user metadata directly from the session
      const user = sessionData.session.user;
      const userId = user.id;
      
      console.log('Current user ID:', userId);
      
      // Check if user has admin/owner role using session metadata first
      // This avoids having to query the profiles table which can cause RLS recursion
      let userRole = null;
      
      // Try to get role from session metadata if available
      if (user.app_metadata && user.app_metadata.role) {
        userRole = user.app_metadata.role;
        console.log('Found role in app_metadata:', userRole);
      } else if (user.user_metadata && user.user_metadata.role) {
        userRole = user.user_metadata.role;
        console.log('Found role in user_metadata:', userRole);
      }
      
      // If we have the role in metadata, use it
      if (userRole) {
        const canManage = userRole === 'admin' || userRole === 'owner';
        setHasPermission(canManage);
        
        if (!canManage) {
          setPermissionError('Insufficient permissions');
          return { hasPermission: false, error: 'User does not have sufficient permissions' };
        }
        
        return { hasPermission: true, error: null };
      }
      
      // As a fallback, we'll perform a direct, simplified query with an alternative approach
      // This direct query avoids the risk of recursion in RLS policies
      try {
        // Only query id and role to minimize data and reduce risk of RLS recursion
        const { data: roleData, error: roleError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();
        
        if (roleError) {
          console.error('Error checking user role:', roleError.message);
          // Fall back to another authorization method if available
          // For now, we'll deny access
          setPermissionError(roleError.message);
          setHasPermission(false);
          return { hasPermission: false, error: `Error checking user role: ${roleError.message}` };
        }
        
        if (roleData) {
          console.log('User role from direct query:', roleData.role);
          
          const canManage = roleData.role === 'admin' || roleData.role === 'owner';
          
          setHasPermission(canManage);
          
          if (!canManage) {
            console.warn('User does not have sufficient permissions');
            setPermissionError('Insufficient permissions');
            return { hasPermission: false, error: 'User does not have sufficient permissions' };
          }
          
          return { hasPermission: true, error: null };
        } else {
          console.error('No role information found');
          setPermissionError('No role information found');
          setHasPermission(false);
          return { hasPermission: false, error: 'No role information found' };
        }
      } catch (queryError: any) {
        console.error('Error in role query:', queryError.message);
        setPermissionError(`Role query error: ${queryError.message}`);
        setHasPermission(false);
        return { hasPermission: false, error: queryError.message };
      }
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
