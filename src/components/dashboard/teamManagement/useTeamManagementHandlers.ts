
import { useTeamDialogsState } from '@/hooks/useTeamDialogsState';
import { useTeamMemberHandlers } from '../handlers/TeamMemberHandlers';
import { TeamMember, Profile, PendingMember } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface UseTeamManagementHandlersProps {
  companyId: string;
  preRegisteredMembers: PendingMember[];
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  setEditMode: (mode: boolean) => void;
  handleRefresh: () => void;
  dialogsState: ReturnType<typeof useTeamDialogsState>;
  memberHandlers: ReturnType<typeof useTeamMemberHandlers>;
  inviteUrl: string;
}

export const useTeamManagementHandlers = ({
  companyId,
  preRegisteredMembers,
  selectedMembers,
  setSelectedMembers,
  setEditMode,
  handleRefresh,
  dialogsState,
  memberHandlers,
  inviteUrl
}: UseTeamManagementHandlersProps) => {
  const {
    memberToDelete,
    isPendingMemberToDelete,
    currentMember,
    openDeleteDialog,
    openEditDialog,
    closeDeleteDialog,
    closeAddEditDialog
  } = dialogsState;

  const {
    handleSaveMemberWrapper,
    handleConfirmDelete,
    handleBulkDelete: bulkDelete
  } = memberHandlers;

  // Handlers
  const handleEditMember = (member: TeamMember) => {
    openEditDialog(member);
  };

  const handleDeleteMember = (memberId: string) => {
    const isPending = preRegisteredMembers.some(m => m.id === memberId);
    openDeleteDialog(memberId, isPending);
  };

  const handleDeleteMemberClick = handleDeleteMember;

  const handleSendPreRegisteredInvite = async (member: TeamMember) => {
    if (!('isPending' in member) || !member.isPending) {
      toast.error('This action is only available for pre-registered members');
      return;
    }

    const email = member.email;
    if (!email || !email.trim()) {
      toast.error('Email address is required to send an invite');
      return;
    }

    try {
      // Send the email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-bulk-invites', {
        body: { inviteIds: [member.id] }
      });

      if (emailError) {
        logger.error('Error sending invite email:', emailError);
        toast.error('Failed to send invite email');
        return;
      }
      
      toast.success(`Invite sent to ${email}`);
      handleRefresh();
    } catch (e: any) {
      logger.error('Error sending invite:', e);
      toast.error(e.message || 'Error sending invite');
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard!');
  };

  const handleConfirmDeleteWrapper = async () => {
    const success = await handleConfirmDelete(memberToDelete, isPendingMemberToDelete);
    if (success) {
      closeDeleteDialog();
    }
  };

  const handleSaveMemberDialogSubmit = async (memberData: Partial<Profile | PendingMember> & { avatarFile?: File | null }): Promise<boolean> => {
    logger.debug('handleSaveMemberDialogSubmit called with data:', memberData);
    logger.debug('avatarFile present:', !!memberData.avatarFile);
    const success = await handleSaveMemberWrapper(memberData, currentMember);
    if (success) {
      closeAddEditDialog();
      return true;
    }
    return false;
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedMembers, preRegisteredMembers);
    setSelectedMembers([]);
    setEditMode(false);
  };

  return {
    handleEditMember,
    handleDeleteMember,
    handleDeleteMemberClick,
    handleSendPreRegisteredInvite,
    handleCopyInvite,
    handleBulkDelete,
    handleConfirmDeleteWrapper,
    handleSaveMemberDialogSubmit
  };
};
