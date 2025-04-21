
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
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadingTimeout = setTimeout(() => {
      console.log("AuthGuard: Still loading after 5 seconds. This may indicate an issue.");
    }, 5000);

    const checkAuth = async () => {
      if (!isMounted) return;
      console.log("AuthGuard: Checking authentication...");
      
      try {
        // Check if user is authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthGuard: Error getting session:", sessionError);
          throw sessionError;
        }
        
        if (!sessionData.session) {
          console.log("AuthGuard: No active session, redirecting to auth page");
          if (isMounted) {
            setIsLoading(false);
            setIsAuthorized(false);
            setAuthCheckComplete(true);
            navigate('/auth');
          }
          return;
        }

        const user = sessionData.session.user;
        console.log("AuthGuard: User authenticated", user.id);

        // Check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.log("AuthGuard: Profile fetch error:", profileError.message);
          if (profileError.code === 'PGRST116') { // no rows returned
            console.log("AuthGuard: Profile not found, attempting to create...");
            
            // Ensure user profile exists with retry logic
            let profileExists = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
              console.log(`AuthGuard: Attempt ${attempt} to ensure profile exists`);
              profileExists = await ensureUserProfile(user.id);
              if (profileExists) break;
              
              // Wait before retry
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
              }
            }
            
            if (!profileExists) {
              console.error("AuthGuard: Failed to ensure profile exists after multiple attempts");
              if (isMounted) {
                toast.error("Error setting up your user account");
                setIsLoading(false);
                setIsAuthorized(false);
                setAuthCheckComplete(true);
                navigate('/auth');
              }
              return;
            }
            
            console.log("AuthGuard: Profile created successfully");
          } else {
            console.error("AuthGuard: Unexpected profile error:", profileError);
            throw profileError;
          }
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
            .single();

          if (error) {
            console.error("AuthGuard: Error fetching user profile for role check:", error);
            if (isMounted) {
              toast.error("Error verifying your account permissions");
              setIsLoading(false);
              setIsAuthorized(false);
              setAuthCheckComplete(true);
              navigate('/auth');
            }
            return;
          }

          // Check if user has required role
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = roles.includes(profile.role);

          console.log("AuthGuard: User role:", profile.role, "Required roles:", roles, "Has required role:", hasRequiredRole);

          if (!hasRequiredRole) {
            console.log("AuthGuard: User doesn't have required role", profile.role, "needs", requiredRole);
            if (isMounted) {
              toast.error("You don't have permission to access this page");
              setIsLoading(false);
              setIsAuthorized(false);
              setAuthCheckComplete(true);
              navigate('/dashboard');
            }
            return;
          }
          
          console.log("AuthGuard: User has required role:", profile.role);
        }

        if (isMounted) {
          console.log("AuthGuard: User is authorized, rendering protected content");
          setIsAuthorized(true);
          setIsLoading(false);
          setAuthCheckComplete(true);
        }
      } catch (error) {
        console.error("AuthGuard error:", error);
        if (isMounted) {
          toast.error("Authentication error");
          setIsLoading(false);
          setIsAuthorized(false);
          setAuthCheckComplete(true);
          navigate('/auth');
        }
      }
    };

    checkAuth();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthGuard: Auth state change event:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            console.log("AuthGuard: User signed out, redirecting to auth page");
            setIsAuthorized(false);
            setIsLoading(false);
            setAuthCheckComplete(true);
            navigate('/auth');
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Re-check authorization when signed in or token refreshed
          console.log("AuthGuard: User signed in or token refreshed, rechecking authorization");
          checkAuth();
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
      console.log("AuthGuard: Cleanup called, component unmounted");
    };
  }, [requiredRole, navigate]);

  // Effect to log the current state for debugging
  useEffect(() => {
    console.log("AuthGuard state:", { isLoading, isAuthorized, authCheckComplete });
  }, [isLoading, isAuthorized, authCheckComplete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
          <button 
            onClick={() => window.location.reload()} 
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
