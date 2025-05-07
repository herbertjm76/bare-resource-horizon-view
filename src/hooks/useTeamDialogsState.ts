
import { useState } from 'react';
import { TeamMember, Invite } from '@/components/dashboard/types';

export const useTeamDialogsState = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isPendingMemberToDelete, setIsPendingMemberToDelete] = useState(false);

  // Dialog open handlers
  const openAddDialog = () => {
    setCurrentMember(null);
    setIsAddDialogOpen(true);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (member: TeamMember) => {
    setCurrentMember(member);
    setIsEditDialogOpen(true);
    setIsAddDialogOpen(false);
  };

  const openDeleteDialog = (memberId: string, isPending: boolean = false) => {
    setMemberToDelete(memberId);
    setIsPendingMemberToDelete(isPending);
    setIsDeleteDialogOpen(true);
  };

  const openInviteDialog = (invite: Invite | null = null) => {
    setCurrentInvite(invite);
    setIsInviteDialogOpen(true);
  };

  // Dialog close handlers
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
