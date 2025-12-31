
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Invite } from '@/components/dashboard/types';
import { logger } from '@/utils/logger';

export const useInviteActions = (triggerRefresh: () => void) => {
  const copyInviteUrl = (inviteUrl: string) => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Invite link copied!');
  };

  const deleteInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);
        
      if (error) throw error;
      
      toast.success('Invite deleted successfully');
      triggerRefresh();
    } catch (error: any) {
      logger.error('Error deleting invite:', error);
      toast.error(error.message || 'Failed to delete invite');
    }
  };

  const resendInvite = async (invite: Invite) => {
    try {
      // Update created_at to current time instead of using updated_at
      const { error } = await supabase
        .from('invites')
        .update({ created_at: new Date().toISOString() })
        .eq('id', invite.id);
        
      if (error) throw error;
      
      toast.success(`Invite resent to ${invite.email}`);
      triggerRefresh();
    } catch (error: any) {
      logger.error('Error resending invite:', error);
      toast.error(error.message || 'Failed to resend invite');
    }
  };

  return {
    copyInviteUrl,
    copyInviteCode,
    deleteInvite,
    resendInvite
  };
};
