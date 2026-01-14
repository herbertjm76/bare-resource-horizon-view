
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { TeamMember } from './types';

interface TeamMemberTableHeaderProps {
  editMode: boolean;
  userRole: string;
  teamMembers: TeamMember[];
  selectedMembers: string[];
  onSelectAll: (checked: boolean) => void;
  isAdmin: boolean;
  canViewRoleAndInsights: boolean;
}

export const TeamMemberTableHeader: React.FC<TeamMemberTableHeaderProps> = ({
  editMode,
  userRole,
  teamMembers,
  selectedMembers,
  onSelectAll,
  isAdmin,
  canViewRoleAndInsights
}) => {
  return (
    <thead>
      <tr className="border-b border-gray-200">
        {editMode && ['owner', 'admin'].includes(userRole) && (
          <th className="px-4 py-3 text-left">
            <Checkbox
              checked={selectedMembers.length === teamMembers.length && teamMembers.length > 0}
              onCheckedChange={onSelectAll}
            />
          </th>
        )}
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Member</th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
        {canViewRoleAndInsights && (
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
        )}
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Department</th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Practice Area</th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
        {canViewRoleAndInsights && (
          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Insights</th>
        )}
      </tr>
    </thead>
  );
};
