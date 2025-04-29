
import { useState } from 'react';
import { Profile, PendingMember } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { useActiveMemberService } from './team/useActiveMemberService';
import { usePendingMemberService } from './team/usePendingMemberService';

/**
 * Hook for managing team members (both active and pending)
 */
export const useTeamMembers = (companyId: string | undefined) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Import services for active and pending members
  const { updateActiveMember, deleteActiveMember } = useActiveMemberService(companyId);
  const { updatePendingMember, createPendingMember, deletePendingMember } = usePendingMemberService(companyId);

  /**
   * Save (create or update) a team member
   */
  const handleSaveMember = async (memberData: Partial<Profile | PendingMember>, isEditing: boolean) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsSaving(true);
      console.log('Starting to save member with data:', memberData);
      
      // Enhanced detection of pending members - debugging output
      const hasPendingFlag = 'isPending' in memberData && memberData.isPending === true;
      const hasInvitationType = 'invitation_type' in memberData && memberData.invitation_type !== undefined;
      console.log('isPending check:', hasPendingFlag);
      console.log('invitation_type check:', hasInvitationType);
      
      // Use both flags for determining if this is a pending member
      const isPendingMember = hasPendingFlag || hasInvitationType;
      
      console.log('Is this a pending member?', isPendingMember);
      console.log('Is this an edit operation?', isEditing);
      console.log('Member ID:', memberData.id);

      let success = false;

      if (isEditing && memberData.id) {
        if (isPendingMember) {
          // Update existing pending member
          success = await updatePendingMember(memberData as Partial<PendingMember>);
        } else {
          // Update existing active member
          success = await updateActiveMember(memberData as Partial<Profile>);
        }
      } else {
        // Create new pre-registered member
        success = await createPendingMember(memberData as Partial<PendingMember>);
      }
      
      return success;
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast.error(error.message || 'Failed to save team member');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete a team member
   */
  const handleDeleteMember = async (memberId: string, isPending: boolean = false) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsDeleting(true);
      
      let success = false;
      
      if (isPending) {
        // Delete pending member
        success = await deletePendingMember(memberId);
      } else {
        // Delete active member
        success = await deleteActiveMember(memberId);
      }
      
      if (success) {
        toast.success('Team member deleted successfully');
      }
      
      return success;
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast.error(error.message || 'Failed to delete team member');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleSaveMember,
    handleDeleteMember,
    isSaving,
    isDeleting
  };
};
