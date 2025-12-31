
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

type UserRole = 'owner' | 'admin' | 'member';

interface UseAuthorizationProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  companyId?: string;
  autoRedirect?: boolean;
  recheckOnFocus?: boolean; // re-verify on window focus/visibility
}

export const useAuthorization = ({
  requiredRole = 'member',
  redirectTo = '/dashboard',
  companyId,
  autoRedirect = false,
  recheckOnFocus = true,
}: UseAuthorizationProps = {}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const checkInProgress = useRef(false);
  const lastCheckStartTime = useRef<number | null>(null);
  const lastCheckCompletedTs = useRef<number>(0);

  const checkAuthorization = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (checkInProgress.current) {
      logger.log("useAuthorization: Check already in progress, skipping...");
      return;
    }

    checkInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      logger.log("useAuthorization: Checking authorization...");
      
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        logger.error("useAuthorization: Session error", sessionError);
        setError("Failed to verify your session");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('Session error. Please sign in again.');
          navigate('/auth');
        }
        authChecked.current = true;
        return;
      }
      
      if (!sessionData.session) {
        logger.log("useAuthorization: No active session");
        setError("No active session");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You must be logged in to access this page');
          navigate('/auth');
        }
        authChecked.current = true;
        return;
      }

      logger.log("useAuthorization: Session found for user", sessionData.session.user.id);

      // Get user role using secure RPC and company from profiles
      const [roleResult, profileResult] = await Promise.all([
        supabase.rpc('get_user_role_safe'),
        supabase.from('profiles').select('company_id').eq('id', sessionData.session.user.id).single()
      ]);
      
      const { data: userRoleData, error: roleError } = roleResult;
      const { data: profile, error: profileError } = profileResult;

      if (roleError) {
        logger.error("useAuthorization: Error fetching user role", roleError);
        setError("Error checking authorization");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('Error checking authorization');
          navigate('/auth');
        }
        authChecked.current = true;
        return;
      }

      if (profileError) {
        // Non-fatal when no specific companyId is required
        logger.warn("useAuthorization: Profile fetch error - continuing without profile as no companyId is required", profileError);
      }

      if (!userRoleData) {
        logger.error("useAuthorization: No user role found");
        setError("No user role found");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('User role not found');
          navigate('/auth');
        }
        authChecked.current = true;
        return;
      }

      if (companyId && !profile) {
        logger.error("useAuthorization: No profile found but companyId is required");
        setError("No user profile found");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('User profile not found');
          navigate('/auth');
        }
        authChecked.current = true;
        return;
      }

      logger.log("useAuthorization: Profile and role found", { role: userRoleData, company: profile.company_id });

      // Set the user's role
      setUserRole(userRoleData as UserRole);
      logger.log("useAuthorization: User role", userRoleData);

      // Check if company ID is required and matches
      if (companyId && profile.company_id !== companyId) {
        logger.error("useAuthorization: Company mismatch", profile.company_id, companyId);
        setError("Company access denied");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You do not have access to this company');
          navigate('/dashboard');
        }
        authChecked.current = true;
        return;
      }

      // Check if user has required role
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = roles.includes(userRoleData as UserRole);

      if (!hasRequiredRole) {
        logger.error("useAuthorization: Role mismatch", userRoleData, requiredRole);
        setError("Insufficient permissions");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You do not have permission to access this page');
          navigate(redirectTo);
        }
        authChecked.current = true;
        return;
      }

      // User is authorized
      logger.log("useAuthorization: User is authorized");
      setIsAuthorized(true);
      setError(null);
      authChecked.current = true;
    } catch (error: any) {
      logger.error('Authorization error:', error);
      setError("Authorization check failed");
      setIsAuthorized(false);
      if (autoRedirect) {
        toast.error('An error occurred during authorization');
        navigate('/auth');
      }
    } finally {
      // Finalize
      checkInProgress.current = false;
      lastCheckCompletedTs.current = Date.now();
      setLoading(false);
    }
  }, [companyId, navigate, redirectTo, requiredRole, autoRedirect]);

  useEffect(() => {
    let mounted = true;
    
    logger.log("useAuthorization: Initializing with", {
      requiredRole,
      redirectTo,
      companyId,
      autoRedirect,
      authChecked: authChecked.current
    });
    
    // Removed safety timeout to avoid premature failures
    
    // Only run checkAuthorization if it hasn't been checked yet
    if (!authChecked.current) {
      // Use setTimeout to avoid auth deadlocks
      setTimeout(() => {
        if (mounted) {
          checkAuthorization();
        }
      }, 0);
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      logger.log("useAuthorization: Auth state change", event);
      
      if (!mounted) {
        logger.log("useAuthorization: Component not mounted, skipping auth state change handling");
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        logger.log("useAuthorization: User signed out");
        setIsAuthorized(false);
        setUserRole(null);
        authChecked.current = false;
        if (autoRedirect) {
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
        logger.log("useAuthorization: Auth event:", event);
        
        // CRITICAL: If already authorized, NEVER re-check on these events
        // This prevents the endless "Access Denied" loop when returning to the window
        if (authChecked.current && isAuthorized) {
          logger.log(`useAuthorization: Already authorized, skipping recheck on ${event}`);
          return;
        }
        
        // Skip INITIAL_SESSION if already checked (even if not authorized)
        if (event === 'INITIAL_SESSION' && authChecked.current) {
          logger.log('useAuthorization: Skipping recheck on redundant INITIAL_SESSION');
          return;
        }
        
        // Only re-check if not yet authorized and not yet checked
        if (!authChecked.current) {
          authChecked.current = false;
          setTimeout(() => {
            if (mounted) {
              checkAuthorization();
            }
          }, 0);
        }
      }
    });
    
    // Optional re-check on focus/visibility after sleep
    let handleResume: (() => void) | null = null;
    let handleVisibility: (() => void) | null = null;
    if (recheckOnFocus) {
      handleResume = () => {
        logger.log("useAuthorization: Resuming after focus/visibility");
        authChecked.current = false;
        setTimeout(() => { if (mounted) checkAuthorization(); }, 0);
      };
      window.addEventListener('focus', handleResume);
      handleVisibility = () => { if (document.visibilityState === 'visible' && handleResume) handleResume(); };
      document.addEventListener('visibilitychange', handleVisibility);
    }
    
    return () => {
      logger.log("useAuthorization: Cleanup called");
      mounted = false;

      if (recheckOnFocus) {
        if (handleResume) window.removeEventListener('focus', handleResume);
        if (handleVisibility) document.removeEventListener('visibilitychange', handleVisibility);
      }

      subscription.unsubscribe();
    };
  }, [checkAuthorization, navigate, autoRedirect, recheckOnFocus]);


  return { 
    loading, 
    isAuthorized, 
    userRole, 
    error,
    refreshAuth: useCallback(() => {
      logger.log("useAuthorization: Manual refresh triggered");
      authChecked.current = false;
      checkAuthorization();
    }, [checkAuthorization])
  };
};
