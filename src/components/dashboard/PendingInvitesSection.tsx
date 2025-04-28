
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInvitesTable from './TeamInvitesTable';
import { Invite } from './types';

interface PendingInvitesSectionProps {
  invites: Invite[];
  copyInviteCode: (code: string) => void;
}

const PendingInvitesSection: React.FC<PendingInvitesSectionProps> = ({
  invites,
  copyInviteCode
}) => {
  if (invites.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Pending Invites</CardTitle>
      </CardHeader>
      <CardContent>
        <TeamInvitesTable invitees={invites} copyInviteCode={copyInviteCode} />
      </CardContent>
    </Card>
  );
};

export default PendingInvitesSection;
