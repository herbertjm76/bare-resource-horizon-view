import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, PendingMember } from '@/components/dashboard/types';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Define the user role type based on the database enum
type UserRole = Database['public']['Enums']['user_role'];

export const useTeamMembers = (companyId: string | undefined) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      
      console.log('Is this a pending member?', isPendingMember, 'Member data:', memberData);
      console.log('Is this an edit operation?', isEditing);
      console.log('Member ID:', memberData.id);

      // Get user session to check permissions
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session found');
        toast.error('You must be logged in to manage team members');
        return false;
      }
      
      console.log('Current user ID:', session.user.id);
      
      // Check user permissions
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      console.log('Current user role:', userProfile?.role);
      
      // Only owners and admins can manage team members
      if (!userProfile || (userProfile.role !== 'owner' && userProfile.role !== 'admin')) {
        console.error('Insufficient permissions, user role:', userProfile?.role);
        toast.error('You do not have permission to manage team members');
        return false;
      }

      if (isEditing && memberData.id) {
        if (isPendingMember) {
          // Update pre-registered member in invites table
          console.log('Updating pre-registered member in invites table:', memberData);
          
          // Extract only the fields we need to update
          const updateData = {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            email: memberData.email,
            role: memberData.role,
            department: memberData.department,
            location: memberData.location,
            job_title: memberData.job_title
          };
          
          console.log('Update data being sent to invites table:', updateData);
          
          const { error, data } = await supabase
            .from('invites')
            .update(updateData)
            .eq('id', memberData.id)
            .eq('company_id', companyId);  // Add company_id check for security

          if (error) {
            console.error('Error updating pre-registered member:', error);
            toast.error(`Failed to update member: ${error.message}`);
            return false;
          }
          
          console.log('Successfully updated pre-registered member, response:', data);
          toast.success('Pre-registered member updated successfully');
          return true;
        } else {
          // Update existing active member in profiles table ONLY
          console.log('Updating active member in profiles table:', memberData);
          
          // Extract only the fields we need to update in the profiles table
          const updateData = {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            department: memberData.department,
            location: memberData.location,
            job_title: memberData.job_title,
            role: memberData.role as UserRole, // Cast to ensure correct type
            updated_at: new Date().toISOString()
          };
          
          // IMPORTANT: Do not update email in the profiles table as this would cause
          // inconsistency with the auth.users table that we cannot directly update
          
          console.log('Update data being sent to profiles table:', updateData);
          console.log('User ID for update:', memberData.id);
          
          const { error, data } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', memberData.id)
            .eq('company_id', companyId);  // Add company_id check for security

          if (error) {
            console.error('Error updating active member:', error);
            toast.error(`Failed to update member: ${error.message}`);
            return false;
          }
          
          console.log('Successfully updated active member, response data:', data);
          toast.success('Team member updated successfully');
          return true;
        }
      } else {
        // Create new member through invite system
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast.error('You must be logged in to invite team members');
          return false;
        }
        
        // When creating a new pre-registered member, we use the invites table
        console.log('Creating new pre-registered member in invites table');
        const { error, data } = await supabase
          .from('invites')
          .insert({
            email: memberData.email,
            company_id: companyId,
            code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            created_by: session.user.id,
            invitation_type: 'pre_registered',
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            department: memberData.department,
            location: memberData.location,
            job_title: memberData.job_title,
            role: memberData.role
          })
          .select();

        if (error) {
          console.error('Error creating pre-registered member:', error);
          toast.error(`Failed to create member: ${error.message}`);
          return false;
        }
        
        console.log('Successfully created pre-registered member, response:', data);
        toast.success('Pre-registered new team member');
        return true;
      }
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast.error(error.message || 'Failed to save team member');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (memberId: string, isPending: boolean = false) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return false;
    }

    try {
      setIsDeleting(true);
      
      // Get user session to check permissions
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session found');
        toast.error('You must be logged in to manage team members');
        return false;
      }
      
      // Check user permissions
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking user permissions:', profileError);
        toast.error('Failed to verify your permissions');
        return false;
      }
      
      // Only owners and admins can delete team members
      if (!userProfile || (userProfile.role !== 'owner' && userProfile.role !== 'admin')) {
        console.error('Insufficient permissions, user role:', userProfile?.role);
        toast.error('You do not have permission to delete team members');
        return false;
      }
      
      if (isPending) {
        console.log('Deleting pending member from invites table:', memberId);
        // Delete from invites table
        const { error } = await supabase
          .from('invites')
          .delete()
          .eq('id', memberId)
          .eq('company_id', companyId); // Add company_id check for security
          
        if (error) {
          console.error('Error deleting from invites:', error);
          toast.error(`Failed to delete member: ${error.message}`);
          return false;
        }
        
        console.log('Successfully deleted from invites table');
      } else {
        console.log('Deleting active member from profiles table:', memberId);
        // Delete from profiles table
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', memberId)
          .eq('company_id', companyId); // Add company_id check for security
          
        if (error) {
          console.error('Error deleting from profiles:', error);
          toast.error(`Failed to delete member: ${error.message}`);
          return false;
        }
        
        console.log('Successfully deleted from profiles table');
      }
      
      toast.success('Team member deleted successfully');
      return true;
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
