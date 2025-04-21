
import React, { useEffect, useState } from 'react';
import { ClipboardCopy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invite = Database['public']['Tables']['invites']['Row'];

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
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Team Management</h2>
          <Button onClick={copyInviteUrl} variant="secondary">
            Copy Invite Link
          </Button>
        </div>
        
        {/* Invite management section */}
        {['owner', 'admin'].includes(userRole) && (
          <div className="mb-6">
            <h3 className="text-lg text-white font-medium mb-2">Send Invite</h3>
            <form className="flex gap-2" onSubmit={handleSendInvite}>
              <Input
                type="email"
                placeholder="Invite email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-64"
                required
                disabled={invLoading}
              />
              <Button type="submit" variant="default" disabled={invLoading}>
                {invLoading ? 'Sending...' : (
                  <>
                    <Plus className="w-4 h-4 mr-1" /> Send Invite
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* List of existing invites */}
        {invitees.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-2">Pending Invites</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 px-4 text-left text-white/80">Email</th>
                    <th className="py-2 px-4 text-left text-white/80">Invite Code</th>
                    <th className="py-2 px-4 text-left text-white/80">Status</th>
                    <th className="py-2 px-4 text-left text-white/80">Created</th>
                    <th className="py-2 px-4 text-left text-white/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitees.map(invite => (
                    <tr key={invite.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-2 px-4 text-white">{invite.email || <span className="italic text-white/50">Not set</span>}</td>
                      <td className="py-2 px-4 text-white">{invite.code}</td>
                      <td className="py-2 px-4 text-white">{invite.status}</td>
                      <td className="py-2 px-4 text-white">{new Date(invite.created_at).toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="inline-flex gap-1 text-white"
                          onClick={() => copyInviteCode(invite.code)}
                        >
                          <ClipboardCopy className="h-4 w-4" />
                          Copy Link
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Members */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Team Members ({teamMembers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-4 text-left text-white/80">Name</th>
                  <th className="py-2 px-4 text-left text-white/80">Email</th>
                  <th className="py-2 px-4 text-left text-white/80">Role</th>
                  <th className="py-2 px-4 text-left text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">
                      {member.first_name && member.last_name 
                        ? `${member.first_name} ${member.last_name}`
                        : 'No name provided'}
                    </td>
                    <td className="py-3 px-4 text-white">{member.email}</td>
                    <td className="py-3 px-4 text-white capitalize">{member.role}</td>
                    <td className="py-3 px-4">
                      {userRole === 'owner' && (
                        <Button variant="ghost" size="sm" className="text-white">
                          Manage
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};
