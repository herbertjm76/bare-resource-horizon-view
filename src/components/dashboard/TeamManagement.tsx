
import React from 'react';
import { Profile } from './types';
import { EmptyTeamState } from './teamManagement/EmptyTeamState';
import { TeamManagementContent } from './teamManagement/TeamManagementContent';
import { TeamManagementDialogs } from './teamManagement/TeamManagementDialogs';
import { useTeamManagementState } from './teamManagement/useTeamManagementState';
import { useTeamManagementHandlers } from './teamManagement/useTeamManagementHandlers';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
  onRefresh?: () => void;
}

export const TeamManagement = ({
  teamMembers: activeMembers,
  inviteUrl,
  userRole,
  onRefresh
}: TeamManagementProps) => {
  const {
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
  } = useTeamManagementState({ activeMembers, userRole, onRefresh });

  const handlers = useTeamManagementHandlers({
    companyId,
    preRegisteredMembers,
    selectedMembers,
    setSelectedMembers,
    setEditMode,
    handleRefresh,
    dialogsState,
    memberHandlers,
    inviteUrl
  });

  // Combine active members (filtered) with pre-registered members for display
  const combinedMembers = [...activeMembers, ...preRegisteredMembers];

  // Handle the case when there are no team members and user is admin/owner
  if (combinedMembers.length === 0 && isAdminOrOwner) {
    return (
      <div className="space-y-6">
        <EmptyTeamState onAddMember={dialogsState.openAddDialog} />

        <TeamManagementContent
          allMembers={[]}
          userRole={userRole}
          editMode={editMode}
          setEditMode={setEditMode}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          onEditMember={dialogsState.openEditDialog}
          onDeleteMember={handlers.handleDeleteMemberClick}
          onBulkDelete={handlers.handleBulkDelete}
          onAdd={dialogsState.openAddDialog}
          onRefresh={handleRefresh}
        />

        <TeamManagementDialogs
          isAddDialogOpen={dialogsState.isAddDialogOpen}
          isEditDialogOpen={dialogsState.isEditDialogOpen}
          isDeleteDialogOpen={dialogsState.isDeleteDialogOpen}
          isInviteDialogOpen={dialogsState.isInviteDialogOpen}
          currentMember={dialogsState.currentMember}
          currentInvite={dialogsState.currentInvite}
          companyId={companyId}
          isSaving={memberHandlers.isSaving}
          isDeleting={memberHandlers.isDeleting}
          onCloseAddEdit={dialogsState.closeAddEditDialog}
          onCloseDelete={dialogsState.closeDeleteDialog}
          onCloseInvite={dialogsState.closeInviteDialog}
          onSaveMember={handlers.handleSaveMemberDialogSubmit}
          onConfirmDelete={handlers.handleConfirmDeleteWrapper}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamManagementContent
        allMembers={combinedMembers}
        userRole={userRole}
        editMode={editMode}
        setEditMode={setEditMode}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onEditMember={handlers.handleEditMember}
        onDeleteMember={handlers.handleDeleteMember}
        onSendInvite={handlers.handleSendPreRegisteredInvite}
        onBulkDelete={handlers.handleBulkDelete}
        onAdd={dialogsState.openAddDialog}
        onRefresh={handleRefresh}
      />

      <TeamManagementDialogs
        isAddDialogOpen={dialogsState.isAddDialogOpen}
        isEditDialogOpen={dialogsState.isEditDialogOpen}
        isDeleteDialogOpen={dialogsState.isDeleteDialogOpen}
        isInviteDialogOpen={dialogsState.isInviteDialogOpen}
        currentMember={dialogsState.currentMember}
        currentInvite={dialogsState.currentInvite}
        companyId={companyId}
        isSaving={memberHandlers.isSaving}
        isDeleting={memberHandlers.isDeleting}
        onCloseAddEdit={dialogsState.closeAddEditDialog}
        onCloseDelete={dialogsState.closeDeleteDialog}
        onCloseInvite={dialogsState.closeInviteDialog}
        onSaveMember={handlers.handleSaveMemberDialogSubmit}
        onConfirmDelete={handlers.handleConfirmDeleteWrapper}
      />
    </div>
  );
};

export default TeamManagement;
