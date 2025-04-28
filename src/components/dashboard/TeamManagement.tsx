
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TeamInvitesTable from './TeamInvitesTable';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import MemberDialog from './MemberDialog';
import DeleteMemberDialog from './DeleteMemberDialog';
import TeamInviteControls from './TeamInviteControls';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile, PendingMember, TeamMember, Invite } from './types';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({
  teamMembers: activeMembers,
  inviteUrl,
  userRole
}: TeamManagementProps) => {
  const [invitees, setInvitees] = useState<Invite[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Profile | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isPendingMemberToDelete, setIsPendingMemberToDelete] = useState(false);
  
  const companyId = activeMembers[0]?.company_id;
  
  const {
    handleSaveMember,
    handleDeleteMember,
    isSaving,
    isDeleting
  } = useTeamMembers(companyId);
  
  const {
    inviteEmail,
    setInviteEmail,
    invLoading,
    handleSendInvite
  } = useTeamInvites(companyId);

  // Fetch invites whenever refreshFlag changes to ensure UI is updated
  useEffect(() => {
    const fetchInvites = async () => {
      if (userRole === 'owner' || userRole === 'admin') {
        console.log('Fetching invites - refresh flag:', refreshFlag);
        const {
          data: invites,
          error
        } = await supabase.from('invites').select('*').eq('company_id', companyId).eq('status', 'pending').order('created_at', {
          ascending: false
        });
        if (error) {
          toast.error('Failed to load invites');
          console.error('Error fetching invites:', error);
        } else {
          console.log('Fetched invites:', invites?.length || 0);
          setInvitees(invites ?? []);
        }
      }
    };
    
    if (companyId) {
      fetchInvites();
    }
  }, [companyId, userRole, refreshFlag]);

  const pendingMembers: PendingMember[] = invitees.map(invite => ({
    ...invite,
    isPending: true
  }));
  
  const preRegisteredMembers = pendingMembers.filter(member => member.invitation_type === 'pre_registered');
  const allMembers: TeamMember[] = [...activeMembers, ...preRegisteredMembers];

  const handleSaveMemberWrapper = async (memberData: Partial<Profile>) => {
    const success = await handleSaveMember(memberData, Boolean(currentMember));
    if (success) {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setCurrentMember(null);
      setRefreshFlag(prev => prev + 1);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setCurrentMember(member as Profile);
    setIsEditDialogOpen(true);
  };

  // Renamed from handleDeleteMember to openDeleteDialog to avoid conflict
  const openDeleteDialog = (memberId: string) => {
    const isPending = pendingMembers.some(m => m.id === memberId);
    setMemberToDelete(memberId);
    setIsPendingMemberToDelete(isPending);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    console.log('Deleting member:', memberToDelete, 'isPending:', isPendingMemberToDelete);
    const success = await handleDeleteMember(memberToDelete, isPendingMemberToDelete);
    
    if (success) {
      setMemberToDelete(null);
      setIsPendingMemberToDelete(false);
      setIsDeleteDialogOpen(false);
      // Increment refresh flag to trigger data refetch
      setRefreshFlag(prev => prev + 1);
      console.log('Delete successful, refreshFlag updated');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMembers.length) return;
    
    try {
      const deletePromises = selectedMembers.map(memberId => {
        const isPending = pendingMembers.some(m => m.id === memberId);
        return handleDeleteMember(memberId, isPending);
      });
      
      await Promise.all(deletePromises);
      toast.success(`${selectedMembers.length} team members deleted successfully`);
      setSelectedMembers([]);
      setEditMode(false);
      setRefreshFlag(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete team members");
      console.error(error);
    }
  };

  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Invite link copied!');
  };

  return <div className="space-y-6">
      {['owner', 'admin'].includes(userRole) && <div className="flex justify-end">
          <TeamInviteControls onAdd={() => setIsAddDialogOpen(true)} onCopyInvite={copyInviteUrl} companyId={companyId} />
        </div>}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Registration List</CardTitle>
          {['owner', 'admin'].includes(userRole) && <TeamMembersToolbar editMode={editMode} setEditMode={setEditMode} selectedCount={selectedMembers.length} onBulkDelete={handleBulkDelete} onAdd={() => setIsAddDialogOpen(true)} />}
        </CardHeader>
        <CardContent>
          <TeamMembersTable 
            teamMembers={allMembers} 
            userRole={userRole} 
            editMode={editMode} 
            selectedMembers={selectedMembers} 
            setSelectedMembers={setSelectedMembers} 
            onEditMember={handleEditMember} 
            onDeleteMember={openDeleteDialog} 
          />
        </CardContent>
      </Card>

      {invitees.filter(invite => invite.invitation_type === 'email_invite').length > 0 && <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamInvitesTable invitees={invitees.filter(invite => invite.invitation_type === 'email_invite')} copyInviteCode={copyInviteCode} />
          </CardContent>
        </Card>}

      <MemberDialog isOpen={isAddDialogOpen || isEditDialogOpen} onClose={() => {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setCurrentMember(null);
    }} member={currentMember} onSave={handleSaveMemberWrapper} title={isEditDialogOpen ? "Edit Team Member" : "Add Team Member"} isLoading={isSaving} />

      <DeleteMemberDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setMemberToDelete(null);
        }} 
        onConfirm={handleConfirmDelete} 
        isLoading={isDeleting}
      />
    </div>;
};

export default TeamManagement;
