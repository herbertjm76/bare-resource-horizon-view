
import { useState } from 'react';
import { Profile, PendingMember, Invite, TeamMember } from '@/components/dashboard/types';

export const useTeamDialogsState = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isPendingMemberToDelete, setIsPendingMemberToDelete] = useState(false);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    console.log('Editing member:', member, 'isPending:', 'isPending' in member);
    setCurrentMember(member);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (memberId: string, isPending: boolean) => {
    setMemberToDelete(memberId);
    setIsPendingMemberToDelete(isPending);
    setIsDeleteDialogOpen(true);
  };

  const openInviteDialog = () => {
    setIsInviteDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setCurrentMember(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const closeInviteDialog = () => {
    setIsInviteDialogOpen(false);
    setCurrentInvite(null);
  };

  return {
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
    openInviteDialog,
    closeAddEditDialog,
    closeDeleteDialog,
    closeInviteDialog
  };
};
