
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useTeamInvites } from '@/hooks/useTeamInvites';
import { Profile, PendingMember, TeamMember, Invite } from './types';
import TeamHeader from './TeamHeader';
import TeamMemberSection from './TeamMemberSection';
import PendingInvitesSection from './PendingInvitesSection';
import TeamDialogs from './TeamDialogs';
import InviteMembersDialog from './InviteMembersDialog';

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
  const [inviteEditMode, setInviteEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Profile | PendingMember | null>(null);
  const [currentInvite, setCurrentInvite] = useState<Invite | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isPendingMemberToDelete, setIsPendingMemberToDelete] = useState(false);
  
  const companyId = activeMembers[0]?.company_id;
  
  const { handleSaveMember, handleDeleteMember, isSaving, isDeleting } = useTeamMembers(companyId);
  const { inviteEmail, setInviteEmail, invLoading, handleSendInvite } = useTeamInvites(companyId);

  // Fetch invites whenever refreshFlag changes to ensure UI is updated
  useEffect(() => {
    const fetchInvites = async () => {
      if (userRole === 'owner' || userRole === 'admin') {
        console.log('Fetching invites - refresh flag:', refreshFlag);
        const { data: invites, error } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
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
  const emailInvites = invitees.filter(invite => invite.invitation_type === 'email_invite');
  const allMembers: TeamMember[] = [...activeMembers, ...preRegisteredMembers];

  const handleSaveMemberWrapper = async (memberData: Partial<Profile>) => {
    console.log('Saving member data:', memberData, 'Is pending:', 'isPending' in memberData);
    
    const success = await handleSaveMember(memberData, Boolean(currentMember));
    if (success) {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setCurrentMember(null);
      setRefreshFlag(prev => prev + 1);
      console.log('Save successful, refreshFlag updated to:', refreshFlag + 1);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    console.log('Editing member:', member, 'isPending:', 'isPending' in member);
    setCurrentMember(member);
    setIsEditDialogOpen(true);
  };

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

  const handleDeleteInvite = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId);
        
      if (error) throw error;
      
      toast.success('Invite deleted successfully');
      setRefreshFlag(prev => prev + 1);
    } catch (error: any) {
      console.error('Error deleting invite:', error);
      toast.error(error.message || 'Failed to delete invite');
    }
  };

  const handleResendInvite = async (invite: Invite) => {
    try {
      // Here you would integrate with your email service to resend the invite
      // For now, we'll just show a toast message
      toast.success(`Invite resent to ${invite.email}`);
      
      // Optionally update the invite's created_at time in the database
      const { error } = await supabase
        .from('invites')
        .update({ created_at: new Date().toISOString() })
        .eq('id', invite.id);
        
      if (error) throw error;
      
      setRefreshFlag(prev => prev + 1);
    } catch (error: any) {
      console.error('Error resending invite:', error);
      toast.error(error.message || 'Failed to resend invite');
    }
  };

  const toggleInviteEditMode = () => {
    setInviteEditMode(!inviteEditMode);
  };

  const handleCloseAddEditDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setCurrentMember(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleCloseInviteDialog = () => {
    setIsInviteDialogOpen(false);
    setCurrentInvite(null);
  };

  const isAdminOrOwner = ['owner', 'admin'].includes(userRole);

  return (
    <div className="space-y-6">
      <TeamMemberSection
        teamMembers={allMembers}
        userRole={userRole}
        editMode={editMode}
        setEditMode={setEditMode}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onEditMember={handleEditMember}
        onDeleteMember={openDeleteDialog}
        onBulkDelete={handleBulkDelete}
        onAdd={() => setIsAddDialogOpen(true)}
      />

      <PendingInvitesSection 
        invites={emailInvites}
        copyInviteCode={copyInviteCode}
        onCopyInvite={copyInviteUrl}
        onInviteMember={() => setIsInviteDialogOpen(true)}
        onResendInvite={handleResendInvite}
        onDeleteInvite={handleDeleteInvite}
        showControls={isAdminOrOwner}
        editMode={inviteEditMode}
        onToggleEditMode={toggleInviteEditMode}
      />

      <TeamDialogs
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        currentMember={currentMember}
        onCloseAddEdit={handleCloseAddEditDialog}
        onCloseDelete={handleCloseDeleteDialog}
        onSaveMember={handleSaveMemberWrapper}
        onConfirmDelete={handleConfirmDelete}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <InviteMembersDialog
        isOpen={isInviteDialogOpen}
        onClose={handleCloseInviteDialog}
        companyId={companyId}
        currentInvite={currentInvite}
      />
    </div>
  );
};

export default TeamManagement;
