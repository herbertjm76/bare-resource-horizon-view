
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("AuthGuard: Checking authentication...");
      setIsLoading(true);

      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not logged in, redirect to auth page
          console.log("AuthGuard: No active session, redirecting to auth page");
          navigate('/auth');
          return;
        }

        const user = session.user;
        console.log("AuthGuard: User authenticated", user.id);

        // Check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError || !profileData) {
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
            toast.error("Error setting up your user account");
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
            .single();

          if (error || !profile) {
            console.error("AuthGuard: Error fetching user profile or profile not found:", error);
            toast.error("Error verifying your account permissions");
            navigate('/auth');
            return;
          }

          // Check if user has required role
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          const hasRequiredRole = roles.includes(profile.role);

          if (!hasRequiredRole) {
            console.log("AuthGuard: User doesn't have required role", profile.role, "needs", requiredRole);
            toast.error("You don't have permission to access this page");
            navigate('/dashboard');
            return;
          }
          
          console.log("AuthGuard: User has required role:", profile.role);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("AuthGuard error:", error);
        toast.error("Authentication error");
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthGuard: Auth state change:", event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [requiredRole, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;
