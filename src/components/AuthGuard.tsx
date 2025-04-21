
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ensureUserProfile } from '@/utils/authHelpers';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authAttempts, setAuthAttempts] = useState(0);
  const navigate = useNavigate();

  const checkAuth = async () => {
    console.log(`AuthGuard: Check auth attempt ${authAttempts + 1}`);
    setAuthAttempts(prev => prev + 1);
    
    try {
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("AuthGuard: Error getting session:", sessionError);
        setAuthError("Failed to verify your session");
        setIsLoading(false);
        setIsAuthorized(false);
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

      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("AuthGuard: Profile fetch error:", profileError);
        setAuthError("Error retrieving your user profile");
        setIsLoading(false);
        setIsAuthorized(false);
        navigate('/auth');
        return;
      }
      
      // If profile doesn't exist, create it
      if (!profileData) {
        console.log("AuthGuard: Profile not found, attempting to create...");
        const profileCreated = await ensureUserProfile(user.id);
        
        if (!profileCreated) {
          console.error("AuthGuard: Failed to create user profile");
          toast.error("Error setting up your user account");
          setIsLoading(false);
          setIsAuthorized(false);
          navigate('/auth');
          return;
        }
        
        console.log("AuthGuard: Profile created successfully");
      } else {
        console.log("AuthGuard: Existing profile found", profileData);
      }

      // If role check is required
      if (requiredRole) {
        console.log("AuthGuard: Checking role requirement:", requiredRole);
        
        // Get user profile to check role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("AuthGuard: Error fetching user profile for role check:", error);
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

  // Handle manual refresh
  const handleRefresh = () => {
    console.log("AuthGuard: Manual refresh triggered");
    setIsLoading(true);
    setAuthError(null);
    checkAuth();
  };

  // Initialize auth check
  useEffect(() => {
    let isMounted = true;
    
    // Set a safety timeout to prevent getting stuck in loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.error("AuthGuard: Safety timeout triggered after 10 seconds");
        setIsLoading(false);
        setAuthError("Verification timed out. Please try refreshing.");
      }
    }, 10000);
    
    // Log loading state for debugging
    const loadingInterval = setInterval(() => {
      if (isMounted && isLoading) {
        console.log("AuthGuard: Still in loading state after", authAttempts, "attempts");
      }
    }, 3000);
    
    // Initial auth check
    if (isMounted) {
      checkAuth();
    }
    
    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      clearInterval(loadingInterval);
      console.log("AuthGuard: Cleanup called, component unmounted");
    };
  }, []);

  // Set up auth state change listener
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
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
      subscription.data.subscription.unsubscribe();
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
            className="mt-4 text-xs text-blue-500 hover:underline"
          >
            Taking too long? Click to refresh
          </button>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;
