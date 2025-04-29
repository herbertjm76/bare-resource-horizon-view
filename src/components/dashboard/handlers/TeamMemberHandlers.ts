
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
      console.log('Calling handleSaveMember with data:', memberDataCopy, 'isEditing:', Boolean(currentMember));
      const success = await handleSaveMember(memberDataCopy, Boolean(currentMember));
      if (success) {
        // Ensure refresh happens even if there are other issues
        setTimeout(() => {
          console.log('Triggering refresh after successful save');
          triggerRefresh();
        }, 200);
        
        console.log('Save successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in handleSaveMemberWrapper:', error);
      toast.error(`Failed to save team member: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const handleConfirmDelete = async (memberToDelete: string | null, isPendingMemberToDelete: boolean) => {
    if (!memberToDelete) return false;
    
    console.log('Deleting member:', memberToDelete, 'isPending:', isPendingMemberToDelete);
    try {
      const success = await handleDeleteMember(memberToDelete, isPendingMemberToDelete);
      
      if (success) {
        // Ensure refresh happens after deletion
        setTimeout(() => {
          console.log('Triggering refresh after successful delete');
          triggerRefresh();
        }, 200);
        
        toast.success(isPendingMemberToDelete ? 'Pre-registered member deleted successfully' : 'Team member deleted successfully');
        console.log('Delete successful');
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
      console.log('Bulk deleting members:', selectedMembers);
      const deletePromises = selectedMembers.map(memberId => {
        const isPending = pendingMembers.some(m => m.id === memberId);
        console.log(`Deleting member ${memberId}, isPending: ${isPending}`);
        return handleDeleteMember(memberId, isPending);
      });
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      
      // Always trigger refresh after bulk delete
      setTimeout(() => {
        console.log('Triggering refresh after bulk delete');
        triggerRefresh();
      }, 200);
      
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
