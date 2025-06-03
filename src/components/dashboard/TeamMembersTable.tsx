
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Edit, Mail } from 'lucide-react';
import { TeamMember } from './types';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  userRole,
  editMode,
  selectedMembers,
  setSelectedMembers,
  onEditMember,
  onDeleteMember
}) => {
  const navigate = useNavigate();

  const getUserInitials = (member: TeamMember) => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(teamMembers.map(member => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    }
  };

  const handleViewMember = (memberId: string) => {
    navigate(`/team-members/${memberId}`);
  };

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    // Only access avatar_url if the member has this property (i.e., is a Profile, not PendingMember)
    return 'avatar_url' in member ? member.avatar_url : undefined;
  };

  // Check if user can view insights (admin, owner, or PM roles)
  const canViewInsights = ['owner', 'admin', 'pm'].includes(userRole.toLowerCase());

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No team members found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {editMode && ['owner', 'admin'].includes(userRole) && (
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectedMembers.length === teamMembers.length && teamMembers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
            )}
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Member</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Insights</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              {editMode && ['owner', 'admin'].includes(userRole) && (
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getAvatarUrl(member)} />
                    <AvatarFallback className="bg-brand-violet text-white">
                      {getUserInitials(member)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge className={`${getRoleBadgeColor(member.role)} border`}>
                  {member.role?.charAt(0).toUpperCase() + member.role?.slice(1) || 'Member'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-900">
                  {member.department || '-'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-900">
                  {member.location || '-'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {canViewInsights && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewMember(member.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {editMode && ['owner', 'admin'].includes(userRole) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditMember(member)}
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersTable;
