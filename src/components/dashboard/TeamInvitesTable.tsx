
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { Invite } from "./TeamManagement";

interface TeamInvitesTableProps {
  invitees: Invite[];
  copyInviteCode: (code: string) => void;
}

const TeamInvitesTable: React.FC<TeamInvitesTableProps> = ({
  invitees,
  copyInviteCode,
}) => {
  if (invitees.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Invites</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 text-left text-gray-600">Email</th>
              <th className="py-2 px-4 text-left text-gray-600">Invite Code</th>
              <th className="py-2 px-4 text-left text-gray-600">Status</th>
              <th className="py-2 px-4 text-left text-gray-600">Created</th>
              <th className="py-2 px-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitees.map(invite => (
              <tr key={invite.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-900">{invite.email || <span className="italic text-gray-500">Not set</span>}</td>
                <td className="py-2 px-4 text-gray-900">{invite.code}</td>
                <td className="py-2 px-4 text-gray-900">{invite.status}</td>
                <td className="py-2 px-4 text-gray-900">{new Date(invite.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="inline-flex gap-1 text-gray-700"
                    onClick={() => copyInviteCode(invite.code)}
                  >
                    <ClipboardCopy className="h-4 w-4" />
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
