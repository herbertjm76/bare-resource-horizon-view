
import React from 'react';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Loader2 } from 'lucide-react';

type UserRole = 'owner' | 'admin' | 'member';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  companyId?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole = 'member',
  redirectTo = '/dashboard',
  companyId,
}) => {
  const { loading, isAuthorized } = useAuthorization({
    requiredRole,
    redirectTo,
    companyId,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};
