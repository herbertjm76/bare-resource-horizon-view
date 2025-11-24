
import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember, Profile } from './types';
import { TeamManagement } from './TeamManagement';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';

interface TeamMemberContentProps {
  userProfile: any;
  isProfileLoading: boolean;
  teamMembers: TeamMember[];
  onRefresh?: () => void;
}

// Type guard function to check if a TeamMember is a Profile
const isProfile = (member: TeamMember): member is Profile => {
  return !('isPending' in member);
};

export const TeamMemberContent: React.FC<TeamMemberContentProps> = ({
  userProfile,
  isProfileLoading,
  teamMembers,
  onRefresh
}) => {
  const { checkUserPermissions, hasPermission, isChecking } = useTeamMembersPermissions();

  // Check permissions on mount
  useEffect(() => {
    checkUserPermissions();
  }, [checkUserPermissions]);

  if (isProfileLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-violet"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  // Generate invite URL
  const inviteUrl = userProfile?.company_id 
    ? `${window.location.origin}/join?company=${userProfile.company_id}`
    : `${window.location.origin}/join`;
 
  // Filter out only active members (Profile types) for TeamManagement using type guard
  const activeMembers: Profile[] = teamMembers.filter(isProfile);

  // Ensure current user's row reflects their actual highest role
  const { data: currentUserRole } = useQuery({
    queryKey: ['currentUserRole', userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id) return null;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userProfile.id);

      if (error || !data) {
        console.error('Failed to load current user role:', error);
        return null;
      }

      let highestRole: string | null = null;
      if (data.some((r: any) => r.role === 'owner')) {
        highestRole = 'owner';
      } else if (data.some((r: any) => r.role === 'admin')) {
        highestRole = 'admin';
      } else if (data.length > 0) {
        highestRole = data[0].role as string;
      }

      return highestRole;
    },
    enabled: !!userProfile?.id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const activeMembersWithCurrentRole = useMemo(() => {
    if (!currentUserRole || !userProfile?.id) return activeMembers;

    return activeMembers.map(member =>
      member.id === userProfile.id ? { ...member, role: currentUserRole } : member
    );
  }, [activeMembers, currentUserRole, userProfile?.id]);
 
  return (
    <div className="space-y-6">
      <TeamManagement
        teamMembers={activeMembersWithCurrentRole}
        inviteUrl={inviteUrl}
        userRole={hasPermission ? 'admin' : 'member'}
        onRefresh={onRefresh}
      />
    </div>
  );
};
