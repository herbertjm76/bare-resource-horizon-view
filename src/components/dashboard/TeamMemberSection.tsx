
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
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle className="text-base sm:text-lg font-medium">
          Registered Members ({teamMembers.length})
        </CardTitle>
        {['owner', 'admin'].includes(userRole) && (
          <div className="w-full sm:w-auto">
            <TeamMembersToolbar 
              editMode={editMode} 
              setEditMode={setEditMode} 
              selectedCount={selectedMembers.length} 
              onBulkDelete={onBulkDelete} 
              onAdd={onAdd} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
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
