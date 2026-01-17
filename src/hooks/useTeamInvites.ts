
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Invite } from '@/components/dashboard/types';
import { logger } from '@/utils/logger';

export const useTeamInvites = (companyId: string | undefined) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invLoading, setInvLoading] = useState(false);

  const handleSendInvite = async (e: React.FormEvent, firstName?: string, lastName?: string, role: string = 'member') => {
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

      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data: inviteData, error } = await supabase
        .from('invites')
        .insert({
          code,
          company_id: companyId,
          email: inviteEmail,
          created_by: session.user.id,
          first_name: firstName || null,
          last_name: lastName || null,
          invitation_type: 'email_invite',
          status: 'pending',
          role: role  // Use the provided role (default 'member')
        })
        .select()
        .single();

      if (error) throw error;
      
      // Send the email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-bulk-invites', {
        body: { inviteIds: [inviteData.id] }
      });

      if (emailError) {
        logger.error('Error sending invite email:', emailError);
        toast.error('Invite created but email failed to send');
        return false;
      }
      
      toast.success('Invite email sent!');
      setInviteEmail('');
      return true;
    } catch (e: any) {
      logger.error('Error sending invite:', e);
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
