
import React from 'react';
import TeamDialogs from '../TeamDialogs';
import InviteMembersDialog from '../InviteMembersDialog';
import { TeamMember, Profile, Invite } from '../types';

interface TeamManagementDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isInviteDialogOpen: boolean;
  currentMember: TeamMember | null;
  currentInvite: Invite | null;
  companyId: string;
  isSaving: boolean;
  isDeleting: boolean;
  onCloseAddEdit: () => void;
  onCloseDelete: () => void;
  onCloseInvite: () => void;
  onSaveMember: (memberData: Partial<Profile | TeamMember>) => Promise<boolean>;
  onConfirmDelete: () => Promise<void>;
}

export const TeamManagementDialogs: React.FC<TeamManagementDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isInviteDialogOpen,
  currentMember,
  currentInvite,
  companyId,
  isSaving,
  isDeleting,
  onCloseAddEdit,
  onCloseDelete,
  onCloseInvite,
  onSaveMember,
  onConfirmDelete
}) => {
  return (
    <>
      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentMember={currentMember}
        onCloseAddEdit={onCloseAddEdit}
        onCloseDelete={onCloseDelete}
        onSaveMember={onSaveMember}
        onConfirmDelete={onConfirmDelete}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <InviteMembersDialog
        isOpen={isInviteDialogOpen}
        onClose={onCloseInvite}
        companyId={companyId}
        currentInvite={currentInvite}
      />
    </>
  );
};
