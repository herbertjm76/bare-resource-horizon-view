
import React from 'react';
import { Button } from '@/components/ui/button';
import { Invite } from './TeamManagement';

interface TeamInvitesTableProps {
  invitees: Invite[];
  copyInviteCode: (code: string) => void;
}

const TeamInvitesTable: React.FC<TeamInvitesTableProps> = ({ invitees, copyInviteCode }) => {
  if (!invitees.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Invites</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left text-gray-600">Email</th>
              <th className="py-2 px-4 text-left text-gray-600">Status</th>
              <th className="py-2 px-4 text-left text-gray-600">Sent</th>
              <th className="py-2 px-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitees.map((invite) => (
              <tr key={invite.id} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-900">{invite.email}</td>
                <td className="py-3 px-4 text-gray-900 capitalize">{invite.status}</td>
                <td className="py-3 px-4 text-gray-900">
                  {new Date(invite.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyInviteCode(invite.code)}
                    className="text-gray-700"
                  >
                    Copy Link
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamInvitesTable;
