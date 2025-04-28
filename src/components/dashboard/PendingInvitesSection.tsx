
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInvitesTable from './TeamInvitesTable';
import { Invite } from './types';
import { Button } from '@/components/ui/button';
import { Copy, Send, Plus } from 'lucide-react';

interface PendingInvitesSectionProps {
  invites: Invite[];
  copyInviteCode: (code: string) => void;
  onCopyInvite: () => void;
  onInviteMember: () => void;
  onEditInvite: (invite: Invite) => void;
  showControls: boolean;
}

const PendingInvitesSection: React.FC<PendingInvitesSectionProps> = ({
  invites,
  copyInviteCode,
  onCopyInvite,
  onInviteMember,
  onEditInvite,
  showControls = true
}) => {
  if (invites.length === 0 && !showControls) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Pending Invites</CardTitle>
        {showControls && (
          <div className="flex items-center gap-2">
            <Button onClick={onInviteMember}>
              <Send className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
            
            <Button variant="outline" onClick={onCopyInvite}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Invite Link
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {invites.length > 0 ? (
          <TeamInvitesTable 
            invitees={invites} 
            copyInviteCode={copyInviteCode} 
            onEditInvite={onEditInvite}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No pending invites. Invite team members to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingInvitesSection;
