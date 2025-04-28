
import React from "react";
import { Button } from "@/components/ui/button";
import { Profile, PendingMember, TeamMember } from './types';
import { Edit, Trash2, Clock, UserCog } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getStatusStyle } from "./utils/statusColors";

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

  const isPendingMember = (member: TeamMember): member is PendingMember => 'isPending' in member && member.isPending;

  const getMemberStatus = (member: TeamMember) => {
    if (!isPendingMember(member)) {
      return getStatusStyle('active');
    }
    return getStatusStyle(member.invitation_type === 'pre_registered' ? 'pre_registered' : 'invited');
  };

  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary text-left">
          {teamMembers.length} {teamMembers.length === 1 ? 'Member' : 'Members'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {editMode && <TableHead className="w-10"></TableHead>}
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>System Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              {editMode && <TableHead className="w-20"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map(member => {
            const status = getMemberStatus(member);
            const fullName = isPendingMember(member) ? `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email : `${member.first_name} ${member.last_name}`;
            return <TableRow key={member.id} className="group hover:bg-gray-50 transition-colors duration-150">
                  {editMode && <TableCell>
                      <Checkbox checked={selectedMembers.includes(member.id)} onCheckedChange={() => handleSelectMember(member.id)} />
                    </TableCell>}
                  <TableCell className="font-medium">{fullName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">
                    {isPendingMember(member) ? member.role || "member" : member.role}
                  </TableCell>
                  <TableCell>
                    {member.department || "—"}
                  </TableCell>
                  <TableCell>
                    {member.location || "—"}
                  </TableCell>
                  {editMode && <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditMember && onEditMember(member)}>
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
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDeleteMember && onDeleteMember(member.id)}>
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
                    </TableCell>}
                </TableRow>;
          })}
          </TableBody>
        </Table>
      </div>
    </div>;
};

export default TeamMembersTable;
