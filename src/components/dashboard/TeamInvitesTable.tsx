
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
import { Badge } from "@/components/ui/badge";
import { Send, Trash2 } from 'lucide-react';

interface TeamInvitesTableProps {
  invitees: Invite[];
  copyInviteCode: (code: string) => void;
  editMode?: boolean;
  onResendInvite?: (invite: Invite) => void;
  onDeleteInvite?: (inviteId: string) => void;
}

const TeamInvitesTable: React.FC<TeamInvitesTableProps> = ({ 
  invitees, 
  copyInviteCode,
  editMode = false,
  onResendInvite,
  onDeleteInvite
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
            <TableHead className="w-[30%]">Email</TableHead>
            <TableHead className="w-[20%]">Status</TableHead>
            <TableHead className="w-[20%]">Sent</TableHead>
            <TableHead className="w-[30%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailInvites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell className="w-[30%]">{invite.email}</TableCell>
              <TableCell className="w-[20%]">
                <Badge 
                  variant="outline" 
                  className={invite.status === 'active' ? 'bg-[#D946EF] text-white' : 'capitalize'}
                >
                  {invite.status}
                </Badge>
              </TableCell>
              <TableCell className="w-[20%]">{new Date(invite.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="w-[30%]">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResendInvite && onResendInvite(invite)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDeleteInvite && onDeleteInvite(invite.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className="h-9"></div> // Empty space holder to maintain layout
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamInvitesTable;
