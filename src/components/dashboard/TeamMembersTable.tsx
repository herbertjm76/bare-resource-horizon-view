
import React from "react";
import { Button } from "@/components/ui/button";
import { Profile } from "./TeamManagement";
import { AlertCircle, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface TeamMembersTableProps {
  teamMembers: Profile[];
  userRole: string;
  editMode?: boolean;
  selectedMembers?: string[];
  setSelectedMembers?: (members: string[]) => void;
  onEditMember?: (member: Profile) => void;
  onDeleteMember?: (memberId: string) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  userRole,
  editMode = false,
  selectedMembers = [],
  setSelectedMembers = () => {},
  onEditMember,
  onDeleteMember
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
        <Table>
          <TableHeader>
            <TableRow>
              {editMode && <TableHead className="w-10"></TableHead>}
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              {editMode && <TableHead className="w-20"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow 
                key={member.id} 
                className="hover:bg-gray-50"
              >
                {editMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleSelectMember(member.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  {member.first_name && member.last_name
                    ? `${member.first_name} ${member.last_name}`
                    : 'No name provided'}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="capitalize">{member.role}</TableCell>
                <TableCell>{member.department || '—'}</TableCell>
                <TableCell>{member.location || '—'}</TableCell>
                {editMode && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onEditMember && onEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteMember && onDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamMembersTable;
