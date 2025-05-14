
import React from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "./TeamManagement";
import { AlertCircle } from "lucide-react";

interface TeamMembersTableProps {
  teamMembers: Profile[];
  userRole: string;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  userRole
}) => {
  if (!teamMembers.length) {
    return (
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Team Members</h3>
        <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/50 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <p className="text-white">No team members found. If you just logged in, you may need to refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-4">
        Team Members ({teamMembers.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-4 text-left text-white/80">Name</th>
              <th className="py-2 px-4 text-left text-white/80">Email</th>
              <th className="py-2 px-4 text-left text-white/80">Role</th>
              <th className="py-2 px-4 text-left text-white/80">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 px-4 text-white">
                  {member.first_name && member.last_name
                    ? `${member.first_name} ${member.last_name}`
                    : 'No name provided'}
                </td>
                <td className="py-3 px-4 text-white">{member.email}</td>
                <td className="py-3 px-4 text-white capitalize">{member.role}</td>
                <td className="py-3 px-4">
                  {userRole === 'owner' && (
                    <Button variant="ghost" size="sm" className="text-white">
                      Manage
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;
