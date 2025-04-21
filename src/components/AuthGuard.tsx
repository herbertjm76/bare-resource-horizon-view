import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = session?.user;

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      if (!user) {
        router.push('/auth');
      } else {
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
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
