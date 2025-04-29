
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
      
      // Enhanced detection of pending members
      // Check both the explicit isPending flag and the specific presence of invitation_type
      const isPendingMember = ('isPending' in memberData && memberData.isPending === true) || 
                             ('invitation_type' in memberData && memberData.invitation_type !== undefined);
      
      console.log('Is this a pending member?', isPendingMember, 'Member data:', memberData);

      if (isEditing && memberData.id) {
        if (isPendingMember) {
          // Update pre-registered member in invites table
          console.log('Updating pre-registered member in invites table:', memberData);
          
          const { error } = await supabase
            .from('invites')
            .update({
              first_name: memberData.first_name,
              last_name: memberData.last_name,
              email: memberData.email,
              role: memberData.role as UserRole, // Cast to ensure correct type
              department: memberData.department,
              location: memberData.location,
              job_title: memberData.job_title
            })
            .eq('id', memberData.id);

          if (error) {
            console.error('Error updating pre-registered member:', error);
            throw error;
          }
          toast.success('Pre-registered member updated successfully');
        } else {
          // Update existing active member in profiles table
          console.log('Updating active member in profiles table:', memberData);
          
          const { error } = await supabase
            .from('profiles')
            .update({
              first_name: memberData.first_name,
              last_name: memberData.last_name,
              email: memberData.email,
              role: memberData.role as UserRole, // Cast to ensure correct type
              department: memberData.department,
              location: memberData.location,
              job_title: memberData.job_title,
              updated_at: new Date().toISOString()
            })
            .eq('id', memberData.id);

          if (error) {
            console.error('Error updating active member:', error);
            throw error;
          }
          toast.success('Team member updated successfully');
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
        const { error } = await supabase
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
            role: memberData.role as UserRole // Cast to ensure correct type
          });

        if (error) {
          console.error('Error creating pre-registered member:', error);
          throw error;
        }
        toast.success('Pre-registered new team member');
      }

      return true;
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
      
      if (isPending) {
        console.log('Deleting pending member from invites table:', memberId);
        // Delete from invites table
        const { error } = await supabase
          .from('invites')
          .delete()
          .eq('id', memberId);
          
        if (error) {
          console.error('Error deleting from invites:', error);
          throw error;
        }
        
        console.log('Successfully deleted from invites table');
      } else {
        console.log('Deleting active member from profiles table:', memberId);
        // Delete from profiles table
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', memberId);
          
        if (error) {
          console.error('Error deleting from profiles:', error);
          throw error;
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
