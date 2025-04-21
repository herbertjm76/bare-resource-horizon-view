
import { useEffect, useState } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // User is not logged in, redirect to auth page
          toast.error('You must be logged in to access this page');
          navigate('/auth');
          return;
        }

        // Get user profile to check role
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, company_id')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          toast.error('Error checking authorization');
          navigate('/auth');
          return;
        }

        // Set the user's role
        setUserRole(profile.role as UserRole);

        // Check if company ID is required and matches
        if (companyId && profile.company_id !== companyId) {
          toast.error('You do not have access to this company');
          navigate('/dashboard');
          return;
        }

        // Check if user has required role
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = roles.includes(profile.role as UserRole);

        if (!hasRequiredRole) {
          toast.error('You do not have permission to access this page');
          navigate(redirectTo);
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization error:', error);
        toast.error('An error occurred during authorization');
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [requiredRole, redirectTo, navigate, companyId]);

  return { loading, isAuthorized, userRole };
};
