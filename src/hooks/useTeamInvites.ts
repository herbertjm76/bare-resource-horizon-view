
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Invite } from '@/components/dashboard/types';

export const useTeamInvites = (companyId: string | undefined) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invLoading, setInvLoading] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvLoading(true);

    try {
      if (!inviteEmail || !companyId) {
        toast.error("Enter an email to invite.");
        return false;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to send invites');
        return false;
      }

      // Generate a unique invite code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Insert the invitation record into the database
      const { error } = await supabase
        .from('invites')
        .insert({
          code,
          company_id: companyId,
          email: inviteEmail,
          created_by: session.user.id,
        });

      if (error) throw error;
      
      toast.success('Invite sent!');
      setInviteEmail('');
      return true;
    } catch (e: any) {
      console.error('Error sending invite:', e);
      toast.error(e.message || 'Error sending invite.');
      return false;
    } finally {
      setInvLoading(false);
    }
  };

  return {
    inviteEmail,
    setInviteEmail,
    invLoading,
    handleSendInvite
  };
};
