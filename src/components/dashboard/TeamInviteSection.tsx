
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

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
}) => (
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
);

export default TeamInviteSection;
