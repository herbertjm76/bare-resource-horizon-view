// TeamManagement.tsx (refactored shell, logic + main state, composes new children)

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';
import TeamInviteSection from './TeamInviteSection';
import TeamInvitesTable from './TeamInvitesTable';
import TeamMembersTable from './TeamMembersTable';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Invite = Database['public']['Tables']['invites']['Row'];

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({ teamMembers, inviteUrl, userRole }: TeamManagementProps) => {
  // --- Invite management state and effects ---
  const [invitees, setInvitees] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invLoading, setInvLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Grab companyId from first available member (all team members should have the same company_id)
  const companyId = teamMembers[0]?.company_id;

  // Fetch invites for this company
  useEffect(() => {
    const fetchInvites = async () => {
      if (userRole === 'owner' || userRole === 'admin') {
        const { data: invites, error } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });
        if (error) {
          toast.error('Failed to load invites');
        } else {
          setInvitees(invites ?? []);
        }
      }
    };
    if (companyId) {
      fetchInvites();
    }
  }, [companyId, userRole, refreshFlag]);

  // Handle sending a new invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvLoading(true);

    // Generate a unique random code, e.g. 8 characters
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      if (!inviteEmail || !companyId) {
        toast.error("Enter an email to invite.");
        setInvLoading(false);
        return;
      }

      // Get the current user's ID for created_by
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to send invites');
        setInvLoading(false);
        return;
      }

      // Insert invite row into supabase
      const { data, error } = await supabase
        .from('invites')
        .insert({
          code,
          company_id: companyId,
          email: inviteEmail,
          created_by: session.user.id, // Add the required created_by field
        });
      if (error) {
        toast.error(error.message || 'Failed to send invite');
      } else {
        toast.success('Invite sent!');
        setInviteEmail('');
        setRefreshFlag(Math.random()); // force re-fetch invites
      }
    } catch (e: any) {
      toast.error(e.message || 'Error sending invite.');
    } finally {
      setInvLoading(false);
    }
  };

  // Handle copying the invite link/code for a specific invite
  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Invite link copied!');
  };

  // Handle copying the global inviteUrl
  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  return (
    <AuthGuard requiredRole={['owner', 'admin']}>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
        {['owner', 'admin'].includes(userRole) && (
          <TeamMembersTable teamMembers={teamMembers} userRole={userRole} />
        )}

        {invitees.length > 0 && (
          <TeamInvitesTable invitees={invitees} copyInviteCode={copyInviteCode} />
        )}

        {['owner', 'admin'].includes(userRole) && (
          <TeamInviteSection
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            invLoading={invLoading}
            handleSendInvite={handleSendInvite}
            inviteUrl={inviteUrl}
            onCopyInviteUrl={() => copyInviteUrl()}
          />
        )}
      </div>
    </AuthGuard>
  );
};
