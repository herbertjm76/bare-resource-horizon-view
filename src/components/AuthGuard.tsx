
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ensureUserProfile } from '@/utils/authHelpers';

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
      setIsLoading(true);

      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not logged in, redirect to auth page
          navigate('/auth');
          return;
        }

        const user = session.user;
        console.log("AuthGuard: User authenticated", user.id);

        // If role check is required
        if (requiredRole) {
          // Get user profile to check role
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Profile fetch error:", error);
            
            // Attempt to create profile if it doesn't exist
            const profileCreated = await ensureUserProfile(user.id);
            
            if (!profileCreated) {
              console.error("Could not create or find profile");
              navigate('/auth');
              return;
            }
            
            // Try again to get the profile after creating it
            const { data: retryProfile, error: retryError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single();
              
            if (retryError || !retryProfile) {
              console.error("Profile still not available after creation attempt");
              navigate('/auth');
              return;
            }
            
            // Check required role with the newly created profile
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            const hasRequiredRole = roles.includes(retryProfile.role);
            
            if (!hasRequiredRole) {
              console.log("User doesn't have required role", retryProfile.role, "needs", requiredRole);
              navigate('/dashboard');
              return;
            }
          } else if (!profile) {
            console.error("No profile found and no error returned");
            navigate('/auth');
            return;
          } else {
            // Check if user has required role with existing profile
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            const hasRequiredRole = roles.includes(profile.role);

            if (!hasRequiredRole) {
              console.log("User doesn't have required role", profile.role, "needs", requiredRole);
              navigate('/dashboard');
              return;
            }
          }
        } else {
          // Even if no role is required, ensure profile exists
          await ensureUserProfile(user.id);
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("AuthGuard error:", error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
};

export default AuthGuard;
