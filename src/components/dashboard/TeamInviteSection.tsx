
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeamInviteSectionProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  invLoading: boolean;
  handleSendInvite: (e: React.FormEvent) => void;
}

const TeamInviteSection: React.FC<TeamInviteSectionProps> = ({
  inviteEmail,
  setInviteEmail,
  invLoading,
  handleSendInvite,
}) => {
  return (
    <form onSubmit={handleSendInvite} className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New Team Member</h3>
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={invLoading}>
          {invLoading ? 'Sending...' : 'Send Invite'}
        </Button>
      </div>
    </form>
  );
};

export default TeamInviteSection;
