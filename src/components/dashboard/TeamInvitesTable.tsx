
import React from 'react';
import { Button } from '@/components/ui/button';
import { Invite } from './types';
import { Badge } from "@/components/ui/badge";
import { Send, Trash2, Mail } from 'lucide-react';
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
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending invites. Invite team members to get started.</p>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Member</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
            {editMode && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {emailInvites.map((invite) => {
            const statusStyle = 
              invite.status?.toLowerCase() === 'active' 
                ? getStatusStyle('active')
                : getStatusStyle('invited');
              
            return (
              <tr key={invite.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-violet text-white flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {invite.first_name && invite.last_name 
                          ? `${invite.first_name} ${invite.last_name}` 
                          : 'Pending Member'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {invite.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${getRoleBadgeColor(invite.role)} border`}>
                    {invite.role?.charAt(0).toUpperCase() + invite.role?.slice(1) || 'Member'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-900">
                    {invite.department || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-900">
                    {invite.location || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge 
                    variant={statusStyle.variant}
                    className={statusStyle.className}
                  >
                    {invite.status || 'Invited'}
                  </Badge>
                </td>
                {editMode && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResendInvite && onResendInvite(invite)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDeleteInvite && onDeleteInvite(invite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TeamInvitesTable;
