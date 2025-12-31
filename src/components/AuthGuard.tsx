import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { logger } from '@/utils/logger';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authChecked = useRef(false);
  const { isDemoMode, user: demoUser, profile: demoProfile } = useDemoAuth();
  
  // Function to check authentication and authorization
  const checkAuth = async () => {
    if (!authChecked.current) {
      logger.log("AuthGuard: Checking authorization...");
      
      // Handle demo mode
      if (isDemoMode && demoUser && demoProfile) {
        logger.log("AuthGuard: Demo mode active, checking demo authorization");
        
        if (requiredRole) {
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = roles.includes(demoProfile.role);
          
          if (!hasRequiredRole) {
            logger.log("AuthGuard: Demo user doesn't have required role", demoProfile.role, "needs", requiredRole);
            toast.error("You don't have permission to access this page");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/dashboard');
            return;
          }
        }
        
        logger.log("AuthGuard: Demo user is authorized");
        setIsAuthorized(true);
        setIsLoading(false);
        setAuthError(null);
        authChecked.current = true;
        return;
      }
      
      // Handle normal auth
      try {
        // First, check if we have an active session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          logger.error("AuthGuard: Error getting session:", sessionError);
          setAuthError("Failed to verify your session");
          setIsLoading(false);
          setIsAuthorized(false);
          toast.error("Session verification failed");
          navigate('/auth');
          return;
        }
        
        if (!sessionData.session) {
          logger.log("AuthGuard: No active session, redirecting to auth page");
          setIsLoading(false);
          setIsAuthorized(false);
          navigate('/auth');
          return;
        }

        const user = sessionData.session.user;
        logger.log("AuthGuard: User authenticated", user.id);

        // If role check is required
        if (requiredRole) {
          logger.log("AuthGuard: Checking role requirement:", requiredRole);
          
          // Get user role using secure RPC
          const { data: userRole, error: roleError } = await supabase.rpc('get_user_role_secure');

          if (roleError) {
            logger.error("AuthGuard: Error fetching user role:", roleError);
            toast.error("Error verifying your account permissions");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/auth');
            return;
          }

          if (!userRole) {
            logger.error("AuthGuard: Role not found for user");
            toast.error("User role not found");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/auth');
            return;
          }

          // Check if user has required role
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = roles.includes(userRole);

          logger.log("AuthGuard: User role:", userRole, "Required roles:", roles, "Has required role:", hasRequiredRole);

          if (!hasRequiredRole) {
            logger.log("AuthGuard: User doesn't have required role", userRole, "needs", requiredRole);
            toast.error("You don't have permission to access this page");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/dashboard');
            return;
          }
          
          logger.log("AuthGuard: User has required role:", userRole);
        }

        logger.log("AuthGuard: User is authorized, rendering protected content");
        setIsAuthorized(true);
        setIsLoading(false);
        setAuthError(null);
        authChecked.current = true;
      } catch (error) {
        logger.error("AuthGuard error:", error);
        toast.error("Authentication error");
        setIsLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    }
  };

  // Manual refresh handler
  const handleRefresh = () => {
    logger.log("AuthGuard: Manual refresh triggered");
    setIsLoading(true);
    setAuthError(null);
    authChecked.current = false;
    checkAuth();
  };

  // Handle authentication state
  useEffect(() => {
    logger.log("AuthGuard: Component mounted");
    let isMounted = true;
    let authTimeout: NodeJS.Timeout | null = null;
    
    // Set a safety timeout to prevent getting stuck in loading
    authTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        logger.error("AuthGuard: Safety timeout triggered after 5 seconds");
        setIsLoading(false);
        setAuthError("Verification timed out. Please try refreshing.");
      }
    }, 5000);
    
    // Only set up auth listener if not in demo mode
    let authListener: any = null;
    
      if (!isDemoMode) {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          logger.log("AuthGuard: Auth state changed:", event);
        
        if (!isMounted) return;
        
        // Directly handle sign out
        if (event === 'SIGNED_OUT') {
          setIsAuthorized(false);
          setIsLoading(false);
          navigate('/auth');
          return;
        }
        
        // For other events, just set auth checked to false to trigger a recheck
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          authChecked.current = false;
          // Use setTimeout to avoid potential deadlocks with Supabase
          setTimeout(() => {
            if (isMounted) checkAuth();
          }, 0);
        }
      });
      authListener = data;
    }
    
    // Then check auth
    checkAuth();
    
    // Clean up
    return () => {
      logger.log("AuthGuard: Component unmounted");
      isMounted = false;
      
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
      
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, requiredRole, isDemoMode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]">
        <div className="flex flex-col items-center gap-3 bg-white/10 p-6 rounded-lg shadow-lg border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-sm text-white font-medium">Verifying access...</p>
          {authError && (
            <p className="text-sm text-red-300 mt-2">{authError}</p>
          )}
          <button 
            onClick={handleRefresh} 
            className="mt-4 px-4 py-2 text-sm flex items-center gap-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;