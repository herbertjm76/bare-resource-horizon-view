
import React from 'react';
import MemberDialog from './MemberDialog';
import DeleteMemberDialog from './DeleteMemberDialog';
import { Profile, PendingMember, TeamMember } from './types';

interface TeamDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  currentMember: TeamMember | null;
  onCloseAddEdit: () => void;
  onCloseDelete: () => void;
  onSaveMember: (data: Partial<Profile | PendingMember>) => Promise<boolean>;
  onConfirmDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

const TeamDialogs: React.FC<TeamDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  currentMember,
  onCloseAddEdit,
  onCloseDelete,
  onSaveMember,
  onConfirmDelete,
  isSaving,
  isDeleting
}) => {
  return (
    <>
      <MemberDialog 
        isOpen={isAddDialogOpen || isEditDialogOpen} 
        onClose={onCloseAddEdit} 
        member={currentMember} 
        onSave={onSaveMember} 
        title={isEditDialogOpen ? "Edit Team Member" : "Add Team Member"} 
        isLoading={isSaving} 
      />

      <DeleteMemberDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete} 
        isLoading={isDeleting}
      />
    </>
  );
};

export default TeamDialogs;
