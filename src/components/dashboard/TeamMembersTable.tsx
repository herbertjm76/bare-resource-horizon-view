
import React from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "./TeamManagement";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TeamMembersTableProps {
  teamMembers: Profile[];
  userRole: string;
  editMode?: boolean;
  selectedMembers?: string[];
  setSelectedMembers?: (members: string[]) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  userRole,
  editMode = false,
  selectedMembers = [],
  setSelectedMembers = () => {}
}) => {
  const handleSelectMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (!teamMembers.length) {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Team Members</h3>
        <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <p className="text-yellow-700">No team members found. If you just logged in, you may need to refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Team Members ({teamMembers.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {editMode && <th className="py-2 px-4 text-left text-gray-600"></th>}
              <th className="py-2 px-4 text-left text-gray-600">Name</th>
              <th className="py-2 px-4 text-left text-gray-600">Email</th>
              <th className="py-2 px-4 text-left text-gray-600">Role</th>
              <th className="py-2 px-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                {editMode && (
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleSelectMember(member.id)}
                    />
                  </td>
                )}
                <td className="py-3 px-4 text-gray-900">
                  {member.first_name && member.last_name
                    ? `${member.first_name} ${member.last_name}`
                    : 'No name provided'}
                </td>
                <td className="py-3 px-4 text-gray-900">{member.email}</td>
                <td className="py-3 px-4 text-gray-900 capitalize">{member.role}</td>
                <td className="py-3 px-4">
                  {userRole === 'owner' && (
                    <Button variant="ghost" size="sm" className="text-gray-700">
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
