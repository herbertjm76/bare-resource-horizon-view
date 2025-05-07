
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';

/**
 * Hook to check if a user has permissions to manage team members
 * Uses a recursion-safe approach by prioritizing session metadata
 */
export const useMemberPermissions = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  /**
   * Checks if the current user has permission to manage team members
   * Uses session metadata ONLY to avoid RLS policy recursion issues
   */
  const checkUserPermissions = useCallback(async () => {
    try {
      setIsChecking(true);
      setPermissionError(null);
      
      console.log('Checking user permissions using session metadata...');
      
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
      
      // CRITICAL: Only use session metadata to determine permissions
      // This avoids RLS recursion completely
      const user = sessionData.session.user;
      
      console.log('Current user ID:', user.id);
      console.log('User metadata:', user.user_metadata);
      console.log('App metadata:', user.app_metadata);
      
      // Extract role from metadata
      let userRole: string | null = null;
      
      // Check app_metadata first (preferred location for role)
      if (user.app_metadata && user.app_metadata.role) {
        userRole = user.app_metadata.role;
        console.log('Found role in app_metadata:', userRole);
      } 
      // Then check user_metadata
      else if (user.user_metadata && user.user_metadata.role) {
        userRole = user.user_metadata.role;
        console.log('Found role in user_metadata:', userRole);
      }
      // If we have JWT claims, check there
      else if (sessionData.session.access_token) {
        try {
          // Try to extract role from JWT claims if it exists
          const jwt = sessionData.session.access_token.split('.')[1];
          const decodedClaims = JSON.parse(atob(jwt));
          
          if (decodedClaims && decodedClaims.role) {
            userRole = decodedClaims.role;
            console.log('Found role in JWT claims:', userRole);
          }
        } catch (e) {
          console.log('Could not extract claims from JWT');
        }
      }
      
      // Set a default role as member if none found
      if (!userRole) {
        // For testing only - set this to 'admin' or 'owner' to bypass permission checks 
        // during development if you're having issues with metadata
        userRole = 'member';
        console.log('No role found in metadata, defaulting to:', userRole);
      }
      
      // Determine if the user has permission based on role
      const canManage = userRole === 'admin' || userRole === 'owner';
      
      console.log('User can manage team members:', canManage);
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
    permissionError,
    // Utility function to pretend user has permissions (for development/fallback)
    forceGrantPermission: () => {
      setHasPermission(true);
      setPermissionError(null);
    }
  };
};
