
import { useTeamDialogsState } from '@/hooks/useTeamDialogsState';
import { useTeamMemberHandlers } from '../handlers/TeamMemberHandlers';
import { TeamMember, Profile } from '../types';

interface UseTeamManagementHandlersProps {
  companyId: string;
  preRegisteredMembers: TeamMember[];
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  setEditMode: (mode: boolean) => void;
  handleRefresh: () => void;
  dialogsState: ReturnType<typeof useTeamDialogsState>;
  memberHandlers: ReturnType<typeof useTeamMemberHandlers>;
}

export const useTeamManagementHandlers = ({
  companyId,
  preRegisteredMembers,
  selectedMembers,
  setSelectedMembers,
  setEditMode,
  handleRefresh,
  dialogsState,
  memberHandlers
}: UseTeamManagementHandlersProps) => {
  const {
    memberToDelete,
    isPendingMemberToDelete,
    currentMember,
    openDeleteDialog,
    closeDeleteDialog,
    closeAddEditDialog
  } = dialogsState;

  const {
    handleSaveMemberWrapper,
    handleConfirmDelete,
    handleBulkDelete
  } = memberHandlers;

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

  return {
    handleDeleteMemberClick,
    handleConfirmDeleteWrapper,
    handleSaveMemberDialogSubmit,
    handleBulkDeleteWrapper
  };
};
