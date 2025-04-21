
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // User is not logged in, redirect to auth page
        navigate('/auth');
        return;
      }

      const user = session.user;

      // If role check is required
      if (requiredRole) {
        // Get user profile to check role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          navigate('/auth');
          return;
        }

        // Check if user has required role
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = roles.includes(profile.role);

        if (!hasRequiredRole) {
          navigate('/dashboard');
          return;
        }
      }

      // Add this additional code to ensure profile exists
      if (user && user.id) {
        import('@/utils/authHelpers').then(({ ensureUserProfile }) => {
          ensureUserProfile(user.id).then((success) => {
            if (!success) {
              console.warn('Failed to ensure user profile exists');
            }
          });
        });
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
