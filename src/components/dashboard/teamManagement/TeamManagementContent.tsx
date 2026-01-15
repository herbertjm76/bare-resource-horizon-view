
import React from 'react';
import { TeamMember } from '../types';
import TeamMemberSection from '../TeamMemberSection';

interface TeamManagementContentProps {
  allMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onSendInvite?: (member: TeamMember) => void;
  onBulkDelete: () => void;
  onAdd: () => void;
  onRefresh?: () => void;
}

export const TeamManagementContent: React.FC<TeamManagementContentProps> = ({
  allMembers,
  userRole,
  editMode,
  setEditMode,
  selectedMembers,
  setSelectedMembers,
  onEditMember,
  onDeleteMember,
  onSendInvite,
  onBulkDelete,
  onAdd,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <TeamMemberSection
        teamMembers={allMembers}
        userRole={userRole}
        editMode={editMode}
        setEditMode={setEditMode}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onEditMember={onEditMember}
        onDeleteMember={onDeleteMember}
        onSendInvite={onSendInvite}
        onBulkDelete={onBulkDelete}
        onAdd={onAdd}
        onRefresh={onRefresh}
      />
    </div>
  );
};
