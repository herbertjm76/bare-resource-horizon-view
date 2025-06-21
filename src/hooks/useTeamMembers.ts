
import { useState } from 'react';
import { Profile, PendingMember } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { useActiveMemberService } from './team/useActiveMemberService';
import { usePendingMemberService } from './team/usePendingMemberService';
import { supabase } from '@/integrations/supabase/client';

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
   * Upload avatar image to Supabase Storage
   */
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      console.log('Starting avatar upload process...');
      
      // Generate a unique filename using timestamp only (no user ID needed)
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName; // Store directly in avatars bucket root

      console.log('Uploading avatar to:', filePath);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting existing files
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload profile picture');
      return null;
    }
  };

  /**
   * Save (create or update) a team member
   */
  const handleSaveMember = async (
    memberData: Partial<Profile | PendingMember> & { avatarFile?: File | null }, 
    isEditing: boolean
  ) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsSaving(true);
      console.log('Starting to save member with data:', memberData);
      
      // Extract avatar file from member data
      const { avatarFile, ...memberDataWithoutFile } = memberData;
      let avatarUrl = memberDataWithoutFile.avatar_url;

      // Upload avatar if provided
      if (avatarFile) {
        console.log('Avatar file detected, uploading...');
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          console.log('Avatar uploaded, URL:', uploadedUrl);
        } else {
          console.log('Avatar upload failed');
        }
      }

      // Add avatar URL to member data
      const finalMemberData = {
        ...memberDataWithoutFile,
        avatar_url: avatarUrl
      };
      
      console.log('Final member data prepared:', finalMemberData);
      
      // Enhanced detection of pending members - debugging output
      const hasPendingFlag = 'isPending' in finalMemberData && finalMemberData.isPending === true;
      const hasInvitationType = 'invitation_type' in finalMemberData && finalMemberData.invitation_type !== undefined;
      console.log('isPending check:', hasPendingFlag);
      console.log('invitation_type check:', hasInvitationType);
      
      // Use both flags for determining if this is a pending member
      const isPendingMember = hasPendingFlag || hasInvitationType;
      
      console.log('Is this a pending member?', isPendingMember);
      console.log('Is this an edit operation?', isEditing);
      console.log('Member ID:', finalMemberData.id);

      let success = false;

      if (isEditing && finalMemberData.id) {
        console.log('Performing update operation...');
        if (isPendingMember) {
          // Update existing pending member
          console.log('Updating pending member...');
          success = await updatePendingMember(finalMemberData as Partial<PendingMember>);
        } else {
          // Update existing active member
          console.log('Updating active member...');
          success = await updateActiveMember(finalMemberData as Partial<Profile>);
        }
      } else {
        // Create new pre-registered member
        console.log('Creating new pending member...');
        success = await createPendingMember(finalMemberData as Partial<PendingMember>);
      }
      
      console.log('Save operation result:', success);
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
      console.log('Deleting member:', memberId, 'isPending:', isPending);
      
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
