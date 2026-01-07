import { useMemo, createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { logger } from '@/utils/logger';

export type AppRole = 'owner' | 'admin' | 'project_manager' | 'member' | 'contractor';

// Context for "View As" role simulation (admin feature)
interface ViewAsContextType {
  simulatedRole: AppRole | null;
  setSimulatedRole: (role: AppRole | null) => void;
}

const ViewAsContext = createContext<ViewAsContextType>({
  simulatedRole: null,
  setSimulatedRole: () => {},
});

export function ViewAsProvider({ children }: { children: ReactNode }) {
  const [simulatedRole, setSimulatedRole] = useState<AppRole | null>(null);
  return (
    <ViewAsContext.Provider value={{ simulatedRole, setSimulatedRole }}>
      {children}
    </ViewAsContext.Provider>
  );
}

export function useViewAs() {
  return useContext(ViewAsContext);
}

// Define which roles can access which sections
// Roles are hierarchical: owner > admin > project_manager > member/contractor
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  owner: 5,
  admin: 4,
  project_manager: 3,
  member: 2,
  contractor: 1,
};

// Define permissions for different sections
export type Permission = 
  | 'view:overview'
  | 'view:team'
  | 'view:projects'
  | 'view:scheduling'
  | 'view:settings'
  | 'edit:all'
  | 'edit:team'
  | 'edit:projects'
  | 'edit:scheduling';

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  owner: [
    'view:overview', 'view:team', 'view:projects', 'view:scheduling', 'view:settings',
    'edit:all', 'edit:team', 'edit:projects', 'edit:scheduling'
  ],
  admin: [
    'view:overview', 'view:team', 'view:projects', 'view:scheduling', 'view:settings',
    'edit:team', 'edit:projects', 'edit:scheduling'
  ],
  project_manager: [
    'view:overview', 'view:team', 'view:projects', 'view:scheduling', 'view:settings',
    'edit:projects', 'edit:scheduling'
  ],
  member: [
    'view:overview', 'view:team'
  ],
  contractor: [
    'view:overview', 'view:team'
  ],
};

// Section to required permission mapping
export const SECTION_PERMISSIONS: Record<string, Permission> = {
  'OVERVIEW': 'view:overview',
  'ALLOCATE': 'view:scheduling',
  'MANAGE': 'view:team',
};

// Debug info interface for troubleshooting
export interface PermissionDebugInfo {
  userId: string | null;
  companyId: string | null;
  rawRoles: Array<{ role: string; company_id: string }>;
  fetchError: string | null;
  lastFetchedAt: string | null;
}

export function usePermissions() {
  const { simulatedRole } = useViewAs();
  const { isDemoMode } = useDemoAuth();
  const queryClient = useQueryClient();
  
  // Track auth state synchronously to know when we're still bootstrapping
  const [authChecked, setAuthChecked] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Synchronously check auth on mount and subscribe to changes
  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) {
        setAuthUserId(user?.id || null);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setAuthUserId(session?.user?.id || null);
        setAuthChecked(true);
        // Invalidate role cache on auth changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          logger.log('[usePermissions] Auth state changed, invalidating role cache:', event);
          queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        }
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Fetch user's actual role from user_roles table (skip in demo mode)
  const { data: roleData, isLoading: isRoleLoading, error: roleError, isFetched: isRoleFetched } = useQuery({
    queryKey: ['currentUserRole', authUserId, isDemoMode],
    queryFn: async (): Promise<{ role: AppRole; debugInfo: PermissionDebugInfo }> => {
      const debugInfo: PermissionDebugInfo = {
        userId: null,
        companyId: null,
        rawRoles: [],
        fetchError: null,
        lastFetchedAt: new Date().toISOString(),
      };

      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          debugInfo.fetchError = `Auth error: ${authError.message}`;
          logger.error('[usePermissions] Auth error:', authError);
          return { role: 'member', debugInfo };
        }
        
        if (!authData.user) {
          debugInfo.fetchError = 'No authenticated user';
          return { role: 'member', debugInfo };
        }

        debugInfo.userId = authData.user.id;

        // Get user's company ID first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          debugInfo.fetchError = `Profile error: ${profileError.message}`;
          logger.error('[usePermissions] Profile fetch error:', profileError);
          return { role: 'member', debugInfo };
        }

        if (!profile?.company_id) {
          debugInfo.fetchError = 'No company_id in profile';
          return { role: 'member', debugInfo };
        }

        debugInfo.companyId = profile.company_id;

        // Get user's role(s) from user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role, company_id')
          .eq('user_id', authData.user.id)
          .eq('company_id', profile.company_id);

        if (rolesError) {
          debugInfo.fetchError = `Roles error: ${rolesError.message}`;
          logger.error('[usePermissions] Roles fetch error:', rolesError);
          return { role: 'member', debugInfo };
        }

        debugInfo.rawRoles = (rolesData ?? []).map(r => ({ role: r.role, company_id: r.company_id }));

        const roles = (rolesData ?? []).map(r => r.role as AppRole);
        if (roles.length === 0) {
          debugInfo.fetchError = 'No roles found for user+company';
          logger.warn('[usePermissions] No roles found for user:', authData.user.id, 'company:', profile.company_id);
          return { role: 'member', debugInfo };
        }

        // Pick highest role if user has multiple
        const highestRole = roles.reduce<AppRole>((best, role) => {
          return ROLE_HIERARCHY[role] > ROLE_HIERARCHY[best] ? role : best;
        }, roles[0]);

        logger.log('[usePermissions] Role resolved:', highestRole, 'for user:', authData.user.id);
        return { role: highestRole, debugInfo };
      } catch (err: any) {
        debugInfo.fetchError = `Unexpected error: ${err.message}`;
        logger.error('[usePermissions] Unexpected error:', err);
        return { role: 'member', debugInfo };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !isDemoMode && !!authUserId, // Only run when we have a userId and not in demo
  });

  // CRITICAL: permissionsReady tells consumers when role is definitively resolved
  const permissionsReady = useMemo(() => {
    if (isDemoMode) return true; // Demo mode is always ready
    if (!authChecked) return false; // Still checking auth
    if (!authUserId) return true; // No user = ready (unauthorized state)
    return isRoleFetched; // Role query has completed
  }, [isDemoMode, authChecked, authUserId, isRoleFetched]);

  // For backwards compatibility - true when still bootstrapping
  const isLoading = !permissionsReady;

  // In demo mode, always return owner role for full admin access
  const actualRole: AppRole = isDemoMode ? 'owner' : (roleData?.role || 'member');
  const currentRole: AppRole = simulatedRole || actualRole;
  const permissions = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.member;
  const debugInfo = roleData?.debugInfo ?? null;

  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      return permissions.includes(permission);
    };
  }, [permissions]);

  const canViewSection = useMemo(() => {
    return (sectionLabel: string): boolean => {
      const requiredPermission = SECTION_PERMISSIONS[sectionLabel];
      if (!requiredPermission) return true;
      return permissions.includes(requiredPermission);
    };
  }, [permissions]);

  const canEdit = useMemo(() => {
    return permissions.includes('edit:all') || 
           permissions.includes('edit:team') || 
           permissions.includes('edit:projects');
  }, [permissions]);

  const canEditAll = useMemo(() => {
    return permissions.includes('edit:all');
  }, [permissions]);

  const isAtLeastRole = useMemo(() => {
    return (role: AppRole): boolean => {
      return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[role];
    };
  }, [currentRole]);

  // Function to force refresh permissions
  const refreshPermissions = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
  };

  return {
    role: currentRole,
    actualRole,
    isSimulating: simulatedRole !== null,
    permissions,
    hasPermission,
    canViewSection,
    canEdit,
    canEditAll,
    isAtLeastRole,
    isLoading,
    permissionsReady,
    canUseViewAs: actualRole === 'owner' || actualRole === 'admin',
    isSuperAdmin: currentRole === 'owner',
    isAdmin: currentRole === 'admin' || currentRole === 'owner',
    isPM: currentRole === 'project_manager',
    isMember: currentRole === 'member',
    isContractor: currentRole === 'contractor',
    // Debug helpers
    debugInfo,
    roleError: roleError?.message ?? null,
    refreshPermissions,
  };
}
