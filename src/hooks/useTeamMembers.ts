
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/components/dashboard/TeamManagement';
import { toast } from 'sonner';

export const useTeamMembers = (companyId: string | undefined) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMember = async (memberData: Partial<Profile>, isEditing: boolean) => {
    if (!companyId) {
      toast.error('Company ID is required');
      return;
    }

    try {
      setIsSaving(true);

      if (isEditing && memberData.id) {
        // Update existing member
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            email: memberData.email,
            role: memberData.role,
            department: memberData.department,
            location: memberData.location,
            updated_at: new Date().toISOString()
          })
          .eq('id', memberData.id);

        if (error) throw error;
        toast.success('Team member updated successfully');
      } else {
        // Create new member through invite system
        const { error } = await supabase
          .from('invites')
          .insert({
            email: memberData.email,
            company_id: companyId,
            code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          });

        if (error) throw error;
        toast.success('Invitation sent to new team member');
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

  return {
    handleSaveMember,
    isSaving
  };
};
