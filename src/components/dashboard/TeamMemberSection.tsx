
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import { TeamMember } from './types';

interface TeamMemberSectionProps {
  teamMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onBulkDelete: () => void;
  onAdd: () => void;
}

const TeamMemberSection: React.FC<TeamMemberSectionProps> = ({
  teamMembers,
  userRole,
  editMode,
  setEditMode,
  selectedMembers,
  setSelectedMembers,
  onEditMember,
  onDeleteMember,
  onBulkDelete,
  onAdd
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Registered Members</CardTitle>
        {['owner', 'admin'].includes(userRole) && (
          <TeamMembersToolbar 
            editMode={editMode} 
            setEditMode={setEditMode} 
            selectedCount={selectedMembers.length} 
            onBulkDelete={onBulkDelete} 
            onAdd={onAdd} 
          />
        )}
      </CardHeader>
      <CardContent>
        <TeamMembersTable 
          teamMembers={teamMembers} 
          userRole={userRole} 
          editMode={editMode} 
          selectedMembers={selectedMembers} 
          setSelectedMembers={setSelectedMembers} 
          onEditMember={onEditMember} 
          onDeleteMember={onDeleteMember} 
        />
      </CardContent>
    </Card>
  );
};

export default TeamMemberSection;
