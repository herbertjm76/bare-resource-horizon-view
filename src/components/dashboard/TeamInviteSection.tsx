
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, UserPlus } from 'lucide-react';

interface TeamInviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  invLoading: boolean;
  handleSendInvite: (e: React.FormEvent) => void;
  inviteUrl: string;
  onCopyInviteUrl: () => void;
}

const TeamInviteSection: React.FC<TeamInviteSectionProps> = ({
  inviteEmail,
  setInviteEmail,
  invLoading,
  handleSendInvite,
  inviteUrl,
  onCopyInviteUrl,
}) => {
  return (
    <form onSubmit={handleSendInvite} className="mt-8 p-6 border border-gray-200 rounded-lg bg-white/5">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={invLoading}>
          <UserPlus className="mr-2" />
          {invLoading ? 'Sending...' : 'Invite Member'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCopyInviteUrl}>
          <Copy className="mr-2" />
          Copy Invite Link
        </Button>
      </div>
    </form>
  );
};

export default TeamInviteSection;
