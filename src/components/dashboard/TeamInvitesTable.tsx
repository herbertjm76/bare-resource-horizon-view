
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Trash2, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { getStatusStyle } from './utils/statusColors';

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

  const getInviteInitials = (invite: Invite) => {
    const firstName = invite.first_name || '';
    const lastName = invite.last_name || '';
    const email = invite.email || '';
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return '?';
  };

  const getDisplayName = (invite: Invite) => {
    const firstName = invite.first_name || '';
    const lastName = invite.last_name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return invite.email || 'Unnamed Invite';
  };

  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
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
            {emailInvites.map((invite) => {
              const statusStyle = 
                invite.status?.toLowerCase() === 'active' 
                  ? getStatusStyle('active')
                  : getStatusStyle('invited');
                
              return (
                <TableRow key={invite.id}>
                  <TableCell className="w-[30%]">{invite.email}</TableCell>
                  <TableCell className="w-[20%]">
                    <Badge 
                      variant={statusStyle.variant}
                      className={statusStyle.className}
                    >
                      {invite.status || 'Invited'}
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
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Simple List View */}
      <div className="block sm:hidden">
        <div className="space-y-2">
          {emailInvites.map((invite) => (
            <div 
              key={invite.id} 
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-brand-violet text-white text-sm">
                    {getInviteInitials(invite)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 text-base truncate">
                    {getDisplayName(invite)}
                  </div>
                </div>
              </div>
              
              {editMode && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResendInvite && onResendInvite(invite)}
                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 px-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteInvite && onDeleteInvite(invite.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamInvitesTable;
