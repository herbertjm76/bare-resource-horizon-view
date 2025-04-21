
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
      <h3 className="text-lg font-medium text-white mb-2">Pending Invites</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-4 text-left text-white/80">Email</th>
              <th className="py-2 px-4 text-left text-white/80">Invite Code</th>
              <th className="py-2 px-4 text-left text-white/80">Status</th>
              <th className="py-2 px-4 text-left text-white/80">Created</th>
              <th className="py-2 px-4 text-left text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitees.map(invite => (
              <tr key={invite.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-2 px-4 text-white">{invite.email || <span className="italic text-white/50">Not set</span>}</td>
                <td className="py-2 px-4 text-white">{invite.code}</td>
                <td className="py-2 px-4 text-white">{invite.status}</td>
                <td className="py-2 px-4 text-white">{new Date(invite.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="inline-flex gap-1 text-white"
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
