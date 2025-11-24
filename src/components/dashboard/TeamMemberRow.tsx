
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Trash2, Mail } from 'lucide-react';
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
  onRefresh?: () => void;
  pendingChanges: Partial<TeamMember>;
  onFieldChange: (memberId: string, field: string, value: string) => void;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  editMode,
  userRole,
  isSelected,
  onSelectMember,
  onViewMember,
  onEditMember,
  onDeleteMember,
  onRefresh,
  pendingChanges,
  onFieldChange
}) => {
  const getValue = (field: keyof TeamMember): string => {
    if (pendingChanges[field] !== undefined) {
      return String(pendingChanges[field]);
    }
    return String(member[field] || '');
  };

  const handleChange = (field: string, value: string) => {
    onFieldChange(member.id, field, value);
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
          <div className="flex-1">
            {editMode && ['owner', 'admin'].includes(userRole) ? (
              <div className="space-y-1">
                <div className="flex gap-1">
                  <Input
                    value={getValue('first_name')}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="First name"
                    className="h-7 text-sm"
                  />
                  <Input
                    value={getValue('last_name')}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Last name"
                    className="h-7 text-sm"
                  />
                </div>
                <Input
                  value={getValue('email')}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email"
                  className="h-7 text-sm"
                  type="email"
                />
              </div>
            ) : (
              <>
                <div className="font-medium text-gray-900">
                  {`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed'}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {member.email}
                </div>
              </>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {'isPending' in member ? (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
            Pending
          </Badge>
        ) : (
          <Badge 
            className={
              member.role === 'owner' 
                ? "bg-purple-100 text-purple-800 border-purple-200 border" 
                : member.role === 'admin'
                ? "bg-blue-100 text-blue-800 border-blue-200 border"
                : "bg-gray-100 text-gray-800 border-gray-200 border"
            }
          >
            {(member.role || 'member').charAt(0).toUpperCase() + (member.role || 'member').slice(1)}
          </Badge>
        )}
      </td>
      <td className="px-4 py-3">
        {editMode && ['owner', 'admin'].includes(userRole) ? (
          <Input
            value={getValue('department')}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="Department"
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {member.department || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        {editMode && ['owner', 'admin'].includes(userRole) ? (
          <Input
            value={getValue('location')}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Location"
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {member.location || '-'}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {editMode && ['owner', 'admin'].includes(userRole) ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteMember(member.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewMember(member.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};
