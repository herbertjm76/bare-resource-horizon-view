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

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      if (!inviteEmail || !companyId) {
        toast.error("Enter an email to invite.");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to send invites');
        return;
      }

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
