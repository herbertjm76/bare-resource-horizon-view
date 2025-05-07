
import React, { useEffect } from 'react';
import { Profile, TeamMember } from './types';
import TeamMemberSection from './TeamMemberSection';
import PendingInvitesSection from './PendingInvitesSection';
import TeamDialogs from './TeamDialogs';
import InviteMembersDialog from './InviteMembersDialog';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useTeamDialogsState } from '@/hooks/useTeamDialogsState';
import { useInviteActions } from '@/hooks/useInviteActions';
import { useTeamMemberHandlers } from './handlers/TeamMemberHandlers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
  onRefresh?: () => void;
}

export const TeamManagement = ({
  teamMembers: activeMembers,
  inviteUrl,
  userRole,
  onRefresh
}: TeamManagementProps) => {
  const companyId = activeMembers[0]?.company_id;
  
  // Custom hooks for state management
  const {
    preRegisteredMembers,
    emailInvites,
    triggerRefresh,
    editMode,
    setEditMode,
    selectedMembers,
    setSelectedMembers
  } = useTeamMembersState(companyId, userRole);

  // Custom trigger that combines local and parent refresh
  const handleRefresh = () => {
    triggerRefresh();
    if (onRefresh) {
      onRefresh();
    }
  };

  const {
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isInviteDialogOpen,
    currentMember,
    currentInvite,
    memberToDelete,
    isPendingMemberToDelete,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openInviteDialog,
    closeAddEditDialog,
    closeDeleteDialog,
    closeInviteDialog
  } = useTeamDialogsState();

  const {
    copyInviteUrl,
    copyInviteCode,
    deleteInvite,
    resendInvite
  } = useInviteActions(handleRefresh);

  const {
    handleSaveMemberWrapper,
    handleConfirmDelete,
    handleBulkDelete,
    isSaving,
    isDeleting
  } = useTeamMemberHandlers(companyId, handleRefresh);

  // Combine active members and pre-registered members
  const allMembers: TeamMember[] = [...(activeMembers || []), ...preRegisteredMembers];

  // Determine if user has admin privileges
  const isAdminOrOwner = ['owner', 'admin'].includes(userRole);

  // Effect to log team members for debugging
  useEffect(() => {
    console.log('TeamManagement - Active members:', activeMembers?.length || 0);
    console.log('TeamManagement - Pre-registered members:', preRegisteredMembers?.length || 0);
    console.log('TeamManagement - All members:', allMembers?.length || 0);
    console.log('TeamManagement - User role:', userRole);
    console.log('TeamManagement - Company ID:', companyId);
  }, [activeMembers, preRegisteredMembers, allMembers, userRole, companyId]);

  // Handlers
  const handleDeleteMemberClick = (memberId: string) => {
    const isPending = preRegisteredMembers.some(m => m.id === memberId);
    openDeleteDialog(memberId, isPending);
  };

  const handleConfirmDeleteWrapper = async () => {
    const success = await handleConfirmDelete(memberToDelete, isPendingMemberToDelete);
    if (success) {
      closeDeleteDialog();
    }
  };

  const handleSaveMemberDialogSubmit = async (memberData: Partial<Profile | TeamMember>) => {
    const success = await handleSaveMemberWrapper(memberData, currentMember);
    if (success) {
      closeAddEditDialog();
    }
  };

  const handleBulkDeleteWrapper = () => {
    handleBulkDelete(selectedMembers, preRegisteredMembers);
    setSelectedMembers([]);
    setEditMode(false);
  };

  // State for invite section edit mode
  const [inviteEditMode, setInviteEditMode] = React.useState(false);
  const toggleInviteEditMode = () => setInviteEditMode(!inviteEditMode);

  // Handle the case when there are no team members and user is admin/owner
  if (allMembers.length === 0 && isAdminOrOwner) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-center py-8">
              <p className="text-gray-700 mb-6">No team members found. Get started by adding your first team member.</p>
              <Button onClick={openAddDialog}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>

        <PendingInvitesSection 
          invites={emailInvites}
          copyInviteCode={copyInviteCode}
          onCopyInvite={() => copyInviteUrl(inviteUrl)}
          onInviteMember={openInviteDialog}
          onResendInvite={resendInvite}
          onDeleteInvite={deleteInvite}
          showControls={isAdminOrOwner}
          editMode={inviteEditMode}
          onToggleEditMode={toggleInviteEditMode}
        />

        <TeamDialogs
          isAddDialogOpen={isAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          currentMember={currentMember}
          onCloseAddEdit={closeAddEditDialog}
          onCloseDelete={closeDeleteDialog}
          onSaveMember={handleSaveMemberDialogSubmit}
          onConfirmDelete={handleConfirmDeleteWrapper}
          isSaving={isSaving}
          isDeleting={isDeleting}
        />

        <InviteMembersDialog
          isOpen={isInviteDialogOpen}
          onClose={closeInviteDialog}
          companyId={companyId}
          currentInvite={currentInvite}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TeamMemberSection
        teamMembers={allMembers}
        userRole={userRole}
        editMode={editMode}
        setEditMode={setEditMode}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onEditMember={openEditDialog}
        onDeleteMember={handleDeleteMemberClick}
        onBulkDelete={handleBulkDeleteWrapper}
        onAdd={openAddDialog}
      />

      <PendingInvitesSection 
        invites={emailInvites}
        copyInviteCode={copyInviteCode}
        onCopyInvite={() => copyInviteUrl(inviteUrl)}
        onInviteMember={openInviteDialog}
        onResendInvite={resendInvite}
        onDeleteInvite={deleteInvite}
        showControls={isAdminOrOwner}
        editMode={inviteEditMode}
        onToggleEditMode={toggleInviteEditMode}
      />

      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentMember={currentMember}
        onCloseAddEdit={closeAddEditDialog}
        onCloseDelete={closeDeleteDialog}
        onSaveMember={handleSaveMemberDialogSubmit}
        onConfirmDelete={handleConfirmDeleteWrapper}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <InviteMembersDialog
        isOpen={isInviteDialogOpen}
        onClose={closeInviteDialog}
        companyId={companyId}
        currentInvite={currentInvite}
      />
    </div>
  );
};

export default TeamManagement;
