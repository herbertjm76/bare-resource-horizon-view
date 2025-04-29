
import { useState } from 'react';
import { PendingMember, Profile, TeamMember } from '../types';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { toast } from 'sonner';

export const useTeamMemberHandlers = (
  companyId: string | undefined,
  triggerRefresh: () => void
) => {
  const { handleSaveMember, handleDeleteMember, isSaving, isDeleting } = useTeamMembers(companyId);

  const handleSaveMemberWrapper = async (memberData: Partial<Profile | PendingMember>, currentMember: TeamMember | null) => {
    console.log('Saving member data:', memberData);
    
    const memberDataCopy = { ...memberData };
    
    // Ensure we correctly set the isPending flag based on current member
    // Explicit check to determine if the current member is a pending member
    const isPendingMember = currentMember ? ('isPending' in currentMember && currentMember.isPending === true) : false;
    
    if (isPendingMember) {
      console.log('Current member is pending, setting isPending flag');
      // Use a type assertion to set isPending for PendingMember type
      (memberDataCopy as Partial<PendingMember>).isPending = true;
      
      // Also ensure invitation_type is set for pending members
      if (!('invitation_type' in memberDataCopy)) {
        (memberDataCopy as Partial<PendingMember>).invitation_type = 'pre_registered';
      }
    }
    
    try {
      const success = await handleSaveMember(memberDataCopy, Boolean(currentMember));
      if (success) {
        triggerRefresh();
        console.log('Save successful, refreshed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in handleSaveMemberWrapper:', error);
      return false;
    }
  };

  const handleConfirmDelete = async (memberToDelete: string | null, isPendingMemberToDelete: boolean) => {
    if (!memberToDelete) return false;
    
    console.log('Deleting member:', memberToDelete, 'isPending:', isPendingMemberToDelete);
    try {
      const success = await handleDeleteMember(memberToDelete, isPendingMemberToDelete);
      
      if (success) {
        triggerRefresh();
        console.log('Delete successful, refreshed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in handleConfirmDelete:', error);
      return false;
    }
  };

  const handleBulkDelete = async (selectedMembers: string[], pendingMembers: PendingMember[]) => {
    if (!selectedMembers.length) return;
    
    try {
      const deletePromises = selectedMembers.map(memberId => {
        const isPending = pendingMembers.some(m => m.id === memberId);
        return handleDeleteMember(memberId, isPending);
      });
      
      await Promise.all(deletePromises);
      toast.success(`${selectedMembers.length} team members deleted successfully`);
      triggerRefresh();
    } catch (error) {
      toast.error("Failed to delete team members");
      console.error(error);
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
