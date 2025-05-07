
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

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
  
  // Function to check authentication and authorization
  const checkAuth = async () => {
    if (!authChecked.current) {
      console.log("AuthGuard: Checking authorization...");
      
      try {
        // First, check if we have an active session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthGuard: Error getting session:", sessionError);
          setAuthError("Failed to verify your session");
          setIsLoading(false);
          setIsAuthorized(false);
          toast.error("Session verification failed");
          navigate('/auth');
          return;
        }
        
        if (!sessionData.session) {
          console.log("AuthGuard: No active session, redirecting to auth page");
          setIsLoading(false);
          setIsAuthorized(false);
          navigate('/auth');
          return;
        }

        const user = sessionData.session.user;
        console.log("AuthGuard: User authenticated", user.id);

        // If role check is required
        if (requiredRole) {
          console.log("AuthGuard: Checking role requirement:", requiredRole);
          
          // Get user profile to check role - direct query instead of RPC
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error("AuthGuard: Error fetching user profile for role check:", profileError);
            toast.error("Error verifying your account permissions");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/auth');
            return;
          }

          if (!profile) {
            console.error("AuthGuard: Profile not found for role check");
            toast.error("User profile not found");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/auth');
            return;
          }

          // Check if user has required role
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = roles.includes(profile.role);

          console.log("AuthGuard: User role:", profile.role, "Required roles:", roles, "Has required role:", hasRequiredRole);

          if (!hasRequiredRole) {
            console.log("AuthGuard: User doesn't have required role", profile.role, "needs", requiredRole);
            toast.error("You don't have permission to access this page");
            setIsLoading(false);
            setIsAuthorized(false);
            navigate('/dashboard');
            return;
          }
          
          console.log("AuthGuard: User has required role:", profile.role);
        }

        console.log("AuthGuard: User is authorized, rendering protected content");
        setIsAuthorized(true);
        setIsLoading(false);
        setAuthError(null);
        authChecked.current = true;
      } catch (error) {
        console.error("AuthGuard error:", error);
        toast.error("Authentication error");
        setIsLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
      }
    }
  };

  // Manual refresh handler
  const handleRefresh = () => {
    console.log("AuthGuard: Manual refresh triggered");
    setIsLoading(true);
    setAuthError(null);
    authChecked.current = false;
    checkAuth();
  };

  // Handle authentication state
  useEffect(() => {
    console.log("AuthGuard: Component mounted");
    let isMounted = true;
    let authTimeout: NodeJS.Timeout | null = null;
    
    // Set a safety timeout to prevent getting stuck in loading
    authTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.error("AuthGuard: Safety timeout triggered after 5 seconds");
        setIsLoading(false);
        setAuthError("Verification timed out. Please try refreshing.");
      }
    }, 5000);
    
    // First set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthGuard: Auth state changed:", event);
      
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
    
    // Then check auth
    checkAuth();
    
    // Clean up
    return () => {
      console.log("AuthGuard: Component unmounted");
      isMounted = false;
      
      if (authTimeout) {
        clearTimeout(authTimeout);
      }
      
      authListener.subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500">
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
