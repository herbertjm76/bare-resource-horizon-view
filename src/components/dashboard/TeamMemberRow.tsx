
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Edit, Mail } from 'lucide-react';
import { TeamMember } from './types';
import { TeamMemberAvatar } from './TeamMemberAvatar';

interface TeamMemberRowProps {
  member: TeamMember;
  editMode: boolean;
  userRole: string;
  isSelected: boolean;
  onSelectMember: (memberId: string, checked: boolean) => void;
  onViewMember: (memberId: string) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  editMode,
  userRole,
  isSelected,
  onSelectMember,
  onViewMember,
  onEditMember,
  onDeleteMember
}) => {
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
    <tr key={member.id} className="hover:bg-gray-50">
      {editMode && ['owner', 'admin'].includes(userRole) && (
        <td className="px-4 py-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectMember(member.id, checked as boolean)}
          />
        </td>
      )}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <TeamMemberAvatar member={member} />
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
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
          Member
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
          {/* Everyone can view insights now - this is the MVP feature */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewMember(member.id)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
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
  );
};
