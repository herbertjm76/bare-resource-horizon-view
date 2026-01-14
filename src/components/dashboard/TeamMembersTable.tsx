
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamMember } from './types';
import { TeamMemberTableHeader } from './TeamMemberTableHeader';
import { TeamMemberRow } from './TeamMemberRow';
import { usePermissions } from '@/hooks/usePermissions';

interface TeamMembersTableProps {
  teamMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onSendInvite?: (member: TeamMember) => void;
  onRefresh?: () => void;
  pendingChanges: Record<string, Partial<TeamMember>>;
  onFieldChange: (memberId: string, field: string, value: string) => void;
  currentUserId?: string | null;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  teamMembers,
  userRole,
  editMode,
  selectedMembers,
  setSelectedMembers,
  onEditMember,
  onDeleteMember,
  onSendInvite,
  onRefresh,
  pendingChanges,
  onFieldChange,
  currentUserId
}) => {
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();

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
        <TeamMemberTableHeader
          editMode={editMode}
          userRole={userRole}
          teamMembers={teamMembers}
          selectedMembers={selectedMembers}
          onSelectAll={handleSelectAll}
          isAdmin={isAdmin}
        />
        <tbody className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <TeamMemberRow
              key={member.id}
              member={member}
              editMode={editMode}
              userRole={userRole}
              isSelected={selectedMembers.includes(member.id)}
              onSelectMember={handleSelectMember}
              onViewMember={handleViewMember}
              onEditMember={onEditMember}
              onDeleteMember={onDeleteMember}
              onSendInvite={onSendInvite}
              onRefresh={onRefresh}
              pendingChanges={pendingChanges[member.id] || {}}
              onFieldChange={onFieldChange}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamMembersTable;
