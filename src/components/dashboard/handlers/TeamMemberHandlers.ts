import { useState } from 'react';
import { PendingMember, Profile, TeamMember } from '../types';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useTeamMemberHandlers = (
  companyId: string | undefined,
  triggerRefresh: () => void
) => {
  const { handleSaveMember, handleDeleteMember, isSaving, isDeleting } = useTeamMembers(companyId);

  const handleSaveMemberWrapper = async (memberData: Partial<Profile | PendingMember> & { avatarFile?: File | null }, currentMember: TeamMember | null) => {
    logger.debug('handleSaveMemberWrapper - Saving member data:', memberData);
    logger.debug('handleSaveMemberWrapper - avatarFile present:', !!memberData.avatarFile);
    
    // Create a fresh copy to avoid modifying the original object
    const memberDataCopy = { ...memberData };
    
    // Determine if the current member is a pending member
    const isPendingMember = currentMember ? ('isPending' in currentMember && currentMember.isPending === true) : false;
    
    if (isPendingMember) {
      logger.debug('Current member is pending, setting isPending flag');
      // Set isPending for PendingMember type
      (memberDataCopy as Partial<PendingMember>).isPending = true;
      
      // Also ensure invitation_type is set for pending members
      if (!('invitation_type' in memberDataCopy)) {
        (memberDataCopy as Partial<PendingMember>).invitation_type = 'pre_registered';
      }
    }
    
    try {
      logger.debug('Calling handleSaveMember with data:', memberDataCopy, 'isEditing:', Boolean(currentMember));
      logger.debug('Avatar file being passed to handleSaveMember:', !!memberDataCopy.avatarFile);
      const success = await handleSaveMember(memberDataCopy, Boolean(currentMember));
      
      if (success) {
        logger.debug('Save successful, triggering refresh');
        // Trigger refresh
        triggerRefresh();
        return true;
      } else {
        console.error('Save operation returned false');
        return false;
      }
    } catch (error) {
      console.error('Error in handleSaveMemberWrapper:', error);
      toast.error(`Failed to save team member: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const handleConfirmDelete = async (memberToDelete: string | null, isPendingMemberToDelete: boolean) => {
    if (!memberToDelete) return false;
    
    logger.debug('Deleting member:', memberToDelete, 'isPending:', isPendingMemberToDelete);
    try {
      const success = await handleDeleteMember(memberToDelete, isPendingMemberToDelete);
      
      if (success) {
        logger.debug('Delete successful, triggering refresh');
        triggerRefresh();
        toast.success(isPendingMemberToDelete ? 'Pre-registered member deleted successfully' : 'Team member deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in handleConfirmDelete:', error);
      toast.error(`Failed to delete team member: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const handleBulkDelete = async (selectedMembers: string[], pendingMembers: PendingMember[]) => {
    if (!selectedMembers.length) return;
    
    try {
      logger.debug('Bulk deleting members:', selectedMembers);
      const deletePromises = selectedMembers.map(memberId => {
        const isPending = pendingMembers.some(m => m.id === memberId);
        logger.debug(`Deleting member ${memberId}, isPending: ${isPending}`);
        return handleDeleteMember(memberId, isPending);
      });
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      
      triggerRefresh();
      
      if (successCount > 0) {
        toast.success(`${successCount} team member${successCount > 1 ? 's' : ''} deleted successfully`);
      } else {
        toast.error("Failed to delete team members");
      }
    } catch (error) {
      toast.error(`Failed to delete team members: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Error in handleBulkDelete:', error);
    }
  };

  return {
    handleSaveMemberWrapper,
    handleConfirmDelete,
    handleBulkDelete,
    isSaving,
    isDeleting
  };
};
