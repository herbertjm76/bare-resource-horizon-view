
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useState } from 'react';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';

/**
 * Hook to check if a user has permissions to manage team members
 */
export const useMemberPermissions = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { isDemoMode, profile: demoProfile } = useDemoAuth();

  /**
   * Checks if the current user has permission to manage team members
   * Uses only the profiles table to avoid auth.users access issues
   */
  const checkUserPermissions = useCallback(async () => {
    // Demo mode: always allow access (demo user is an owner in demo data)
    if (isDemoMode && demoProfile) {
      setHasPermission(true);
      setPermissionError(null);
      return { hasPermission: true, error: null };
    }

    try {
      logger.log('Checking user permissions...');

      setIsChecking(true);
      setPermissionError(null);

      // Get user session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        logger.error('Error fetching session:', sessionError.message);
        setPermissionError('Error fetching session');
        setHasPermission(false);
        return { hasPermission: false, error: sessionError.message };
      }

      if (!sessionData?.session?.user) {
        logger.error('No active session found');
        setPermissionError('No active session');
        setHasPermission(false);
        return { hasPermission: false, error: 'No active session found' };
      }

      const userId = sessionData.session.user.id;
      logger.log('Current user ID:', userId);

      // Use secure RPC to check if user is admin
      try {
        const { data: isAdmin, error: roleError } = await supabase.rpc('user_is_admin_safe');

        if (roleError) {
          logger.error('Error checking user role:', roleError.message);
          setPermissionError(roleError.message);
          setHasPermission(false);
          return { hasPermission: false, error: `Error checking user role: ${roleError.message}` };
        }

        logger.log('User admin status:', isAdmin);
        setHasPermission(isAdmin === true);

        if (!isAdmin) {
          logger.warn('User does not have sufficient permissions');
          setPermissionError('Insufficient permissions');
          return { hasPermission: false, error: 'User does not have sufficient permissions' };
        }

        return { hasPermission: true, error: null };
      } catch (queryError: any) {
        logger.error('Error in profile query:', queryError.message);
        setPermissionError(`Profile query error: ${queryError.message}`);
        setHasPermission(false);
        return { hasPermission: false, error: queryError.message };
      }
    } catch (error: any) {
      logger.error('Error checking permissions:', error.message);
      setPermissionError(`Error: ${error.message}`);
      setHasPermission(false);
      return { hasPermission: false, error: error.message };
    } finally {
      setIsChecking(false);
    }
  }, [isDemoMode, demoProfile]);

  return {
    checkUserPermissions,
    isChecking,
    hasPermission,
    permissionError,
  };
};

