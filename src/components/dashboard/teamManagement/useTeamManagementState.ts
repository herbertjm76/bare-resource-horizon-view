
import { useState, useEffect, useMemo } from 'react';
import { Profile, TeamMember, PendingMember } from '../types';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useTeamDialogsState } from '@/hooks/useTeamDialogsState';
import { useInviteActions } from '@/hooks/useInviteActions';
import { useTeamMemberHandlers } from '../handlers/TeamMemberHandlers';

interface UseTeamManagementStateProps {
  activeMembers: Profile[];
  userRole: string;
  onRefresh?: () => void;
}

export const useTeamManagementState = ({
  activeMembers,
  userRole,
  onRefresh
}: UseTeamManagementStateProps) => {
  const companyId = activeMembers[0]?.company_id;
  
  // Custom hooks for state management
  const {
    preRegisteredMembers,
    emailInvites,
    triggerRefresh,
    editMode,
    setEditMode,
    selectedMembers,
    setSelectedMembers
  } = useTeamMembersState(companyId, userRole);

  // Custom trigger that combines local and parent refresh
  const handleRefresh = () => {
    triggerRefresh();
    if (onRefresh) {
      onRefresh();
    }
  };

  const dialogsState = useTeamDialogsState();
  const inviteActions = useInviteActions(handleRefresh);
  const memberHandlers = useTeamMemberHandlers(companyId, handleRefresh);

  // Combine active members and pre-registered members
  const allMembers: TeamMember[] = useMemo(() => {
    return [...(activeMembers || []), ...preRegisteredMembers];
  }, [activeMembers, preRegisteredMembers]);

  // Determine if user has admin privileges
  const isAdminOrOwner = ['owner', 'admin'].includes(userRole);

  // State for invite section edit mode
  const [inviteEditMode, setInviteEditMode] = useState(false);
  const toggleInviteEditMode = () => setInviteEditMode(!inviteEditMode);

  // Effect to log team members for debugging
  useEffect(() => {
    console.log('TeamManagement - Active members:', activeMembers?.length || 0);
    console.log('TeamManagement - Pre-registered members:', preRegisteredMembers?.length || 0);
    console.log('TeamManagement - All members:', allMembers?.length || 0);
    console.log('TeamManagement - User role:', userRole);
    console.log('TeamManagement - Company ID:', companyId);
  }, [activeMembers, preRegisteredMembers, allMembers, userRole, companyId]);

  return {
    companyId,
    allMembers,
    preRegisteredMembers,
    emailInvites,
    editMode,
    setEditMode,
    selectedMembers,
    setSelectedMembers,
    isAdminOrOwner,
    inviteEditMode,
    toggleInviteEditMode,
    dialogsState,
    inviteActions,
    memberHandlers,
    handleRefresh
  };
};
