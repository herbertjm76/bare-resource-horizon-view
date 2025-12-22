import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'owner' | 'admin' | 'project_manager' | 'member' | 'contractor';

// Define which roles can access which sections
// Roles are hierarchical: owner > admin > project_manager > member/contractor
const ROLE_HIERARCHY: Record<AppRole, number> = {
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
  'TEAM': 'view:team',
  'PROJECTS': 'view:projects',
  'RESOURCE SCHEDULING': 'view:scheduling',
  'SETTINGS': 'view:settings',
};

export const usePermissions = () => {
  // Fetch user's role from user_roles table
  const { data: userRole, isLoading } = useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return 'member' as AppRole;

      // Get user's company ID first
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', authData.user.id)
        .single();

      if (!profile?.company_id) return 'member' as AppRole;

      // Get user's role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('company_id', profile.company_id)
        .order('role') // Will order by enum value
        .limit(1)
        .single();

      return (roleData?.role as AppRole) || 'member';
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const currentRole: AppRole = userRole || 'member';
  const permissions = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.member;

  const hasPermission = useMemo(() => {
    return (permission: Permission): boolean => {
      return permissions.includes(permission);
    };
  }, [permissions]);

  const canViewSection = useMemo(() => {
    return (sectionLabel: string): boolean => {
      const requiredPermission = SECTION_PERMISSIONS[sectionLabel];
      if (!requiredPermission) return true; // Unknown sections are visible by default
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

  return {
    role: currentRole,
    permissions,
    hasPermission,
    canViewSection,
    canEdit,
    canEditAll,
    isAtLeastRole,
    isLoading,
    // Convenience checks
    isSuperAdmin: currentRole === 'owner',
    isAdmin: currentRole === 'admin' || currentRole === 'owner',
    isPM: currentRole === 'project_manager',
    isMember: currentRole === 'member',
    isContractor: currentRole === 'contractor',
  };
};
