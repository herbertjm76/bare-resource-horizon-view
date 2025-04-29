
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
        console.log('Save successful, triggering immediate refresh');
        // Trigger immediate refresh
        triggerRefresh();
        
        // Also schedule multiple refreshes at intervals to ensure data is updated
        setTimeout(() => {
          console.log('Triggering first delayed refresh (500ms) after successful save');
          triggerRefresh();
        }, 500);
        
        setTimeout(() => {
          console.log('Triggering second delayed refresh (1500ms) after successful save');
          triggerRefresh();
        }, 1500);
        
        // Add a third refresh after a longer delay to ensure data is refreshed
        setTimeout(() => {
          console.log('Triggering third delayed refresh (3000ms) after successful save');
          triggerRefresh();
        }, 3000);
        
        // Add a fourth refresh after an even longer delay
        setTimeout(() => {
          console.log('Triggering fourth delayed refresh (5000ms) after successful save');
          triggerRefresh();
        }, 5000);
        
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
    
    console.log('Deleting member:', memberToDelete, 'isPending:', isPendingMemberToDelete);
    try {
      const success = await handleDeleteMember(memberToDelete, isPendingMemberToDelete);
      
      if (success) {
        console.log('Delete successful, triggering immediate refresh');
        // Trigger immediate refresh
        triggerRefresh();
        
        // Also schedule multiple refreshes at intervals
        setTimeout(() => {
          console.log('Triggering first delayed refresh (500ms) after successful delete');
          triggerRefresh();
        }, 500);
        
        setTimeout(() => {
          console.log('Triggering second delayed refresh (1500ms) after successful delete');
          triggerRefresh();
        }, 1500);
        
        // Add a third refresh after a longer delay
        setTimeout(() => {
          console.log('Triggering third delayed refresh (3000ms) after successful delete');
          triggerRefresh();
        }, 3000);
        
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
      console.log('Bulk deleting members:', selectedMembers);
      const deletePromises = selectedMembers.map(memberId => {
        const isPending = pendingMembers.some(m => m.id === memberId);
        console.log(`Deleting member ${memberId}, isPending: ${isPending}`);
        return handleDeleteMember(memberId, isPending);
      });
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;
      
      // Always trigger multiple refreshes after bulk delete
      triggerRefresh();
      
      setTimeout(() => {
        console.log('Triggering first delayed refresh (500ms) after bulk delete');
        triggerRefresh();
      }, 500);
      
      setTimeout(() => {
        console.log('Triggering second delayed refresh (1500ms) after bulk delete');
        triggerRefresh();
      }, 1500);
      
      setTimeout(() => {
        console.log('Triggering third delayed refresh (3000ms) after bulk delete');
        triggerRefresh();
      }, 3000);
      
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
