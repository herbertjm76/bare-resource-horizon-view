
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'owner' | 'admin' | 'member';

interface UseAuthorizationProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  companyId?: string;
}

export const useAuthorization = ({
  requiredRole = 'member',
  redirectTo = '/dashboard',
  companyId,
}: UseAuthorizationProps = {}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const authTimeout = useRef<NodeJS.Timeout | null>(null);

  const checkAuthorization = useCallback(async () => {
    try {
      console.log("useAuthorization: Checking authorization...");
      setLoading(true);
      setError(null);
      
      // Clear any existing timeout
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }

      // Set a new timeout to prevent getting stuck
      authTimeout.current = setTimeout(() => {
        console.warn("useAuthorization: Authorization check timed out");
        setLoading(false);
        setError("Authorization check timed out. Please try refreshing.");
        toast.error("Authorization check timed out");
      }, 8000);
      
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("useAuthorization: Session error", sessionError);
        setError("Failed to verify your session");
        toast.error('Session error. Please sign in again.');
        navigate('/auth');
        return;
      }
      
      if (!session) {
        console.log("useAuthorization: No active session");
        setError("No active session");
        toast.error('You must be logged in to access this page');
        navigate('/auth');
        return;
      }

      console.log("useAuthorization: Session found for user", session.user.id);

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("useAuthorization: Profile error", profileError);
        setError("Error checking authorization");
        toast.error('Error checking authorization');
        navigate('/auth');
        return;
      }

      if (!profile) {
        console.error("useAuthorization: No profile found");
        setError("No user profile found");
        toast.error('User profile not found');
        navigate('/auth');
        return;
      }

      console.log("useAuthorization: Profile found", profile);

      // Set the user's role
      setUserRole(profile.role as UserRole);
      console.log("useAuthorization: User role", profile.role);

      // Check if company ID is required and matches
      if (companyId && profile.company_id !== companyId) {
        console.error("useAuthorization: Company mismatch", profile.company_id, companyId);
        setError("Company access denied");
        toast.error('You do not have access to this company');
        navigate('/dashboard');
        return;
      }

      // Check if user has required role
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = roles.includes(profile.role as UserRole);

      if (!hasRequiredRole) {
        console.error("useAuthorization: Role mismatch", profile.role, requiredRole);
        setError("Insufficient permissions");
        toast.error('You do not have permission to access this page');
        navigate(redirectTo);
        return;
      }

      // User is authorized
      console.log("useAuthorization: User is authorized");
      setIsAuthorized(true);
      setError(null);
      authChecked.current = true;
    } catch (error) {
      console.error('Authorization error:', error);
      setError("Authorization check failed");
      toast.error('An error occurred during authorization');
      navigate('/auth');
    } finally {
      // Clear the timeout
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
        authTimeout.current = null;
      }
      setLoading(false);
    }
  }, [companyId, navigate, redirectTo, requiredRole]);

  useEffect(() => {
    let mounted = true;
    
    console.log("useAuthorization: Initializing with", {
      requiredRole,
      redirectTo,
      companyId,
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
      checkAuthorization();
    }
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
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
        navigate('/auth');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("useAuthorization: User signed in or token refreshed");
        authChecked.current = false;
        checkAuthorization();
      }
    });
    
    return () => {
      console.log("useAuthorization: Cleanup called");
      mounted = false;
      clearTimeout(safetyTimeout);
      
      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
      
      subscription.unsubscribe();
    };
  }, [checkAuthorization, loading, navigate]);

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
