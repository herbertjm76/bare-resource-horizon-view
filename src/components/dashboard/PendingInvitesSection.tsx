
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInvitesTable from './TeamInvitesTable';
import { Invite } from './types';
import { Button } from '@/components/ui/button';
import { Copy, Send, Edit } from 'lucide-react';

interface PendingInvitesSectionProps {
  invites: Invite[];
  copyInviteCode: (code: string) => void;
  onCopyInvite: () => void;
  onInviteMember: () => void;
  onResendInvite?: (invite: Invite) => void;
  onDeleteInvite?: (inviteId: string) => void;
  showControls: boolean;
  editMode: boolean;
  onToggleEditMode: () => void;
}

const PendingInvitesSection: React.FC<PendingInvitesSectionProps> = ({
  invites,
  copyInviteCode,
  onCopyInvite,
  onInviteMember,
  onResendInvite,
  onDeleteInvite,
  showControls = true,
  editMode = false,
  onToggleEditMode
}) => {
  if (invites.length === 0 && !showControls) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg font-medium">Pending Invites</CardTitle>
          {showControls && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <Button onClick={onInviteMember} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
              
              <Button variant="outline" onClick={onCopyInvite} className="w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" />
                Copy Invite Link
              </Button>
              
              {invites.length > 0 && (
                <Button 
                  variant={editMode ? "default" : "outline"} 
                  onClick={onToggleEditMode}
                  className="w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {editMode ? "Done" : "Edit"}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {invites.length > 0 ? (
          <TeamInvitesTable 
            invitees={invites} 
            copyInviteCode={copyInviteCode} 
            editMode={editMode}
            onResendInvite={onResendInvite}
            onDeleteInvite={onDeleteInvite}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending invites. Invite team members to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingInvitesSection;
