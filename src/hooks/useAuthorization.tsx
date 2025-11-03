
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'owner' | 'admin' | 'member';

interface UseAuthorizationProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  companyId?: string;
  autoRedirect?: boolean;
}

export const useAuthorization = ({
  requiredRole = 'member',
  redirectTo = '/dashboard',
  companyId,
  autoRedirect = false,
}: UseAuthorizationProps = {}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthorization = useCallback(async () => {
    try {
      console.log("useAuthorization: Checking authorization...");
      setLoading(true);
      setError(null);
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Set a new timeout to prevent getting stuck
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn("useAuthorization: Authorization check timed out");
        setLoading(false);
        setError("Authorization check timed out. Please try refreshing.");
        toast.error("Authorization check timed out");
      }, 8000);
      
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("useAuthorization: Session error", sessionError);
        setError("Failed to verify your session");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('Session error. Please sign in again.');
          navigate('/auth');
        }
        return;
      }
      
      if (!sessionData.session) {
        console.log("useAuthorization: No active session");
        setError("No active session");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You must be logged in to access this page');
          navigate('/auth');
        }
        return;
      }

      console.log("useAuthorization: Session found for user", sessionData.session.user.id);

      // Get user role using secure RPC and company from profiles
      const [roleResult, profileResult] = await Promise.all([
        supabase.rpc('get_user_role_secure'),
        supabase.from('profiles').select('company_id').eq('id', sessionData.session.user.id).single()
      ]);
      
      const { data: userRoleData, error: roleError } = roleResult;
      const { data: profile, error: profileError } = profileResult;

      if (roleError || profileError) {
        console.error("useAuthorization: Error fetching user data", roleError || profileError);
        setError("Error checking authorization");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('Error checking authorization');
          navigate('/auth');
        }
        return;
      }

      if (!profile || !userRoleData) {
        console.error("useAuthorization: No profile or role found");
        setError("No user profile found");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('User profile not found');
          navigate('/auth');
        }
        return;
      }

      console.log("useAuthorization: Profile and role found", { role: userRoleData, company: profile.company_id });

      // Set the user's role
      setUserRole(userRoleData as UserRole);
      console.log("useAuthorization: User role", userRoleData);

      // Check if company ID is required and matches
      if (companyId && profile.company_id !== companyId) {
        console.error("useAuthorization: Company mismatch", profile.company_id, companyId);
        setError("Company access denied");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You do not have access to this company');
          navigate('/dashboard');
        }
        return;
      }

      // Check if user has required role
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = roles.includes(userRoleData as UserRole);

      if (!hasRequiredRole) {
        console.error("useAuthorization: Role mismatch", userRoleData, requiredRole);
        setError("Insufficient permissions");
        setIsAuthorized(false);
        if (autoRedirect) {
          toast.error('You do not have permission to access this page');
          navigate(redirectTo);
        }
        return;
      }

      // User is authorized
      console.log("useAuthorization: User is authorized");
      setIsAuthorized(true);
      setError(null);
      authChecked.current = true;
    } catch (error: any) {
      console.error('Authorization error:', error);
      setError("Authorization check failed");
      setIsAuthorized(false);
      if (autoRedirect) {
        toast.error('An error occurred during authorization');
        navigate('/auth');
      }
    } finally {
      // Clear the timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setLoading(false);
    }
  }, [companyId, navigate, redirectTo, requiredRole, autoRedirect]);

  useEffect(() => {
    let mounted = true;
    
    console.log("useAuthorization: Initializing with", {
      requiredRole,
      redirectTo,
      companyId,
      autoRedirect,
      authChecked: authChecked.current
    });
    
    // Set a safety timeout
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("useAuthorization: Safety timeout triggered");
        setLoading(false);
        setError("Authorization check timed out");
      }
    }, 10000);
    
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
      console.log("useAuthorization: Auth state change", event);
      
      if (!mounted) {
        console.log("useAuthorization: Component not mounted, skipping auth state change handling");
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("useAuthorization: User signed out");
        setIsAuthorized(false);
        setUserRole(null);
        authChecked.current = false;
        if (autoRedirect) {
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("useAuthorization: User signed in or token refreshed");
        authChecked.current = false;
        // Use setTimeout to avoid auth deadlocks
        setTimeout(() => {
          if (mounted) {
            checkAuthorization();
          }
        }, 0);
      }
    });
    
    return () => {
      console.log("useAuthorization: Cleanup called");
      mounted = false;
      clearTimeout(safetyTimeout);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      subscription.unsubscribe();
    };
  }, [checkAuthorization, loading, navigate, autoRedirect]);

  return { 
    loading, 
    isAuthorized, 
    userRole, 
    error,
    refreshAuth: useCallback(() => {
      console.log("useAuthorization: Manual refresh triggered");
      authChecked.current = false;
      checkAuthorization();
    }, [checkAuthorization])
  };
};
