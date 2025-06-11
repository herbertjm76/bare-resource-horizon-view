
import React from 'react';
import { TeamMember, Invite } from '../types';
import TeamMemberSection from '../TeamMemberSection';
import PendingInvitesSection from '../PendingInvitesSection';

interface TeamManagementContentProps {
  allMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  emailInvites: Invite[];
  isAdminOrOwner: boolean;
  inviteEditMode: boolean;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onBulkDelete: () => void;
  onAdd: () => void;
  onToggleInviteEditMode: () => void;
  copyInviteCode: (code: string) => void;
  onCopyInvite: () => void;
  onInviteMember: () => void;
  onResendInvite: (invite: Invite) => void;
  onDeleteInvite: (inviteId: string) => void;
}

export const TeamManagementContent: React.FC<TeamManagementContentProps> = ({
  allMembers,
  userRole,
  editMode,
  setEditMode,
  selectedMembers,
  setSelectedMembers,
  emailInvites,
  isAdminOrOwner,
  inviteEditMode,
  onEditMember,
  onDeleteMember,
  onBulkDelete,
  onAdd,
  onToggleInviteEditMode,
  copyInviteCode,
  onCopyInvite,
  onInviteMember,
  onResendInvite,
  onDeleteInvite
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
        onBulkDelete={onBulkDelete}
        onAdd={onAdd}
      />

      <PendingInvitesSection 
        invites={emailInvites}
        copyInviteCode={copyInviteCode}
        onCopyInvite={onCopyInvite}
        onInviteMember={onInviteMember}
        onResendInvite={onResendInvite}
        onDeleteInvite={onDeleteInvite}
        showControls={isAdminOrOwner}
        editMode={inviteEditMode}
        onToggleEditMode={onToggleInviteEditMode}
      />
    </div>
  );
};
