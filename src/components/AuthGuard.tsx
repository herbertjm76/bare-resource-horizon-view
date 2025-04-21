
import React, { useEffect, useState } from 'react';
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

  const handleRefresh = () => {
    console.log("AuthGuard: Manual refresh triggered");
    setIsLoading(true);
    setAuthError(null);
    checkAuth();
  };

  const checkAuth = async () => {
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
        toast.error("Please sign in to continue");
        navigate('/auth');
        return;
      }

      const user = sessionData.session.user;
      console.log("AuthGuard: User authenticated", user.id);

      // If role check is required
      if (requiredRole) {
        console.log("AuthGuard: Checking role requirement:", requiredRole);
        
        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

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
    } catch (error) {
      console.error("AuthGuard error:", error);
      toast.error("Authentication error");
      setIsLoading(false);
      setIsAuthorized(false);
      navigate('/auth');
    }
  };

  // Handle authentication state
  useEffect(() => {
    console.log("AuthGuard: Component mounted");
    let isMounted = true;
    
    // Set a safety timeout to prevent getting stuck in loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.error("AuthGuard: Safety timeout triggered after 10 seconds");
        setIsLoading(false);
        setAuthError("Verification timed out. Please try refreshing.");
      }
    }, 10000);
    
    // Initial auth check
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      console.log("AuthGuard: Auth state change event:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("AuthGuard: User signed out, redirecting to auth page");
        setIsAuthorized(false);
        setIsLoading(false);
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        console.log("AuthGuard: User signed in, checking authorization");
        setIsLoading(true);
        checkAuth();
      }
    });

    return () => {
      console.log("AuthGuard: Component unmounted");
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
          {authError && (
            <p className="text-sm text-red-500">{authError}</p>
          )}
          <button 
            onClick={handleRefresh} 
            className="mt-4 px-4 py-2 text-sm flex items-center gap-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
