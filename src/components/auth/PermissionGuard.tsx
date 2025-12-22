import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions, Permission } from '@/hooks/usePermissions';
import { useCompany } from '@/context/CompanyContext';
import { Loader2, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredSection?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showAccessDenied?: boolean; // If false (default), redirects to dashboard
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  requiredSection,
  fallback,
  redirectTo,
  showAccessDenied = false,
}) => {
  const { hasPermission, canViewSection, isLoading } = usePermissions();
  const { companySlug } = useCompany();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Check permission
  let hasAccess = true;
  
  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  }
  
  if (requiredSection && hasAccess) {
    hasAccess = canViewSection(requiredSection);
  }

  if (!hasAccess) {
    // Default: redirect to dashboard
    const defaultRedirect = companySlug ? `/${companySlug}/dashboard` : '/dashboard';
    
    if (redirectTo) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    // If showAccessDenied is false, redirect to dashboard
    if (!showAccessDenied) {
      return <Navigate to={defaultRedirect} replace />;
    }

    // Default access denied UI
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don't have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

// HOC for wrapping pages with permission checks
export const withPermission = (
  WrappedComponent: React.ComponentType,
  requiredPermission?: Permission,
  requiredSection?: string
) => {
  return function PermissionWrappedComponent(props: any) {
    return (
      <PermissionGuard 
        requiredPermission={requiredPermission}
        requiredSection={requiredSection}
      >
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
};
