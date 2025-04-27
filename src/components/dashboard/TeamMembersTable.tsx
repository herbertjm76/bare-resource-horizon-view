
import React from "react";
import { Button } from "@/components/ui/button";
import { Profile, PendingMember, TeamMember } from './types';
import { Edit, Trash2, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  userRole: string;
  editMode?: boolean;
  selectedMembers?: string[];
  setSelectedMembers?: (members: string[]) => void;
  onEditMember?: (member: TeamMember) => void;
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

  const isPendingMember = (member: TeamMember): member is PendingMember => 
    'isPending' in member && member.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary">
          {teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {editMode && <TableHead className="w-10"></TableHead>}
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
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
                className="group hover:bg-gray-50 transition-colors duration-150"
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
                  {isPendingMember(member) ? (
                    <div className="flex items-center gap-2">
                      {member.email}
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  ) : (
                    `${member.first_name} ${member.last_name}`
                  )}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {isPendingMember(member) ? (
                    <Badge variant="secondary">Invited</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </TableCell>
                <TableCell className="capitalize">
                  {isPendingMember(member) ? "Pending" : member.role}
                </TableCell>
                <TableCell>
                  {isPendingMember(member) ? member.department : "—"}
                </TableCell>
                <TableCell>
                  {isPendingMember(member) ? member.location : "—"}
                </TableCell>
                {editMode && (
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => onEditMember && onEditMember(member)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit member details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => onDeleteMember && onDeleteMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete member</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
