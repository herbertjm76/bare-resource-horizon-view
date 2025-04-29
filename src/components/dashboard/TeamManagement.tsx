
import React from 'react';
import { Profile, TeamMember } from './types';
import TeamMemberSection from './TeamMemberSection';
import PendingInvitesSection from './PendingInvitesSection';
import TeamDialogs from './TeamDialogs';
import InviteMembersDialog from './InviteMembersDialog';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useTeamDialogsState } from '@/hooks/useTeamDialogsState';
import { useInviteActions } from '@/hooks/useInviteActions';
import { useTeamMemberHandlers } from './handlers/TeamMemberHandlers';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({
  teamMembers: activeMembers,
  inviteUrl,
  userRole
}: TeamManagementProps) => {
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

  const {
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isInviteDialogOpen,
    currentMember,
    currentInvite,
    memberToDelete,
    isPendingMemberToDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    closeAddEditDialog,
    closeDeleteDialog,
    closeInviteDialog
  } = useTeamDialogsState();

  const {
    copyInviteUrl,
    copyInviteCode,
    deleteInvite,
    resendInvite
  } = useInviteActions(triggerRefresh);

  const {
    handleSaveMemberWrapper,
    handleConfirmDelete,
    handleBulkDelete,
    isSaving,
    isDeleting
  } = useTeamMemberHandlers(companyId, triggerRefresh);

  // Combine active members and pre-registered members
  const allMembers: TeamMember[] = [...activeMembers, ...preRegisteredMembers];

  // Determine if user has admin privileges
  const isAdminOrOwner = ['owner', 'admin'].includes(userRole);

  // Handlers
  const handleDeleteMemberClick = (memberId: string) => {
    const isPending = preRegisteredMembers.some(m => m.id === memberId);
    openDeleteDialog(memberId, isPending);
  };

  const handleConfirmDeleteWrapper = async () => {
    const success = await handleConfirmDelete(memberToDelete, isPendingMemberToDelete);
    if (success) {
      closeDeleteDialog();
    }
  };

  const handleSaveMemberDialogSubmit = async (memberData: Partial<Profile | TeamMember>) => {
    const success = await handleSaveMemberWrapper(memberData, currentMember);
    if (success) {
      closeAddEditDialog();
    }
  };

  const handleBulkDeleteWrapper = () => {
    handleBulkDelete(selectedMembers, preRegisteredMembers);
    setSelectedMembers([]);
    setEditMode(false);
  };

  // State for invite section edit mode
  const [inviteEditMode, setInviteEditMode] = React.useState(false);
  const toggleInviteEditMode = () => setInviteEditMode(!inviteEditMode);

  return (
    <div className="space-y-6">
      <TeamMemberSection
        teamMembers={allMembers}
        userRole={userRole}
        editMode={editMode}
        setEditMode={setEditMode}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onEditMember={openEditDialog}
        onDeleteMember={handleDeleteMemberClick}
        onBulkDelete={handleBulkDeleteWrapper}
        onAdd={openAddDialog}
      />

      <PendingInvitesSection 
        invites={emailInvites}
        copyInviteCode={copyInviteCode}
        onCopyInvite={() => copyInviteUrl(inviteUrl)}
        onInviteMember={() => closeInviteDialog()}
        onResendInvite={resendInvite}
        onDeleteInvite={deleteInvite}
        showControls={isAdminOrOwner}
        editMode={inviteEditMode}
        onToggleEditMode={toggleInviteEditMode}
      />

      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentMember={currentMember}
        onCloseAddEdit={closeAddEditDialog}
        onCloseDelete={closeDeleteDialog}
        onSaveMember={handleSaveMemberDialogSubmit}
        onConfirmDelete={handleConfirmDeleteWrapper}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <InviteMembersDialog
        isOpen={isInviteDialogOpen}
        onClose={closeInviteDialog}
        companyId={companyId}
        currentInvite={currentInvite}
      />
    </div>
  );
};

export default TeamManagement;
