
import React from 'react';
import { Button } from '@/components/ui/button';
import { Invite } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Copy, Edit } from 'lucide-react';

interface TeamInvitesTableProps {
  invitees: Invite[];
  copyInviteCode: (code: string) => void;
  onEditInvite: (invite: Invite) => void;
}

const TeamInvitesTable: React.FC<TeamInvitesTableProps> = ({ 
  invitees, 
  copyInviteCode,
  onEditInvite 
}) => {
  // Only show email invites
  const emailInvites = invitees.filter(invite => invite.invitation_type === 'email_invite');
  
  if (!emailInvites.length) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailInvites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>{invite.email}</TableCell>
              <TableCell className="capitalize">{invite.status}</TableCell>
              <TableCell>{new Date(invite.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyInviteCode(invite.code)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Link
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditInvite(invite)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamInvitesTable;
