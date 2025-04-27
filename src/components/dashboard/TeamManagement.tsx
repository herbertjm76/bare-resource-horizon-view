
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
import { Profile, Invite } from './types';

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({ teamMembers, inviteUrl, userRole }: TeamManagementProps) => {
  const [invitees, setInvitees] = useState<Invite[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Profile | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const companyId = teamMembers[0]?.company_id;
  const { handleSaveMember, isSaving } = useTeamMembers(companyId);
  const { inviteEmail, setInviteEmail, invLoading, handleSendInvite } = useTeamInvites(companyId);

  useEffect(() => {
    const fetchInvites = async () => {
      if (userRole === 'owner' || userRole === 'admin') {
        const { data: invites, error } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });
        
        if (error) {
          toast.error('Failed to load invites');
        } else {
          setInvitees(invites ?? []);
        }
      }
    };
    
    if (companyId) {
      fetchInvites();
    }
  }, [companyId, userRole, refreshFlag]);

  const handleSaveMemberWrapper = async (memberData: Partial<Profile>) => {
    const success = await handleSaveMember(memberData, Boolean(currentMember));
    if (success) {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setCurrentMember(null);
      setRefreshFlag(prev => prev + 1);
    }
  };

  const handleEditMember = (member: Profile) => {
    setCurrentMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      toast.success("Team member deleted successfully");
      setMemberToDelete(null);
      setIsDeleteDialogOpen(false);
      setRefreshFlag(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete team member");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMembers.length) return;
    try {
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

  return (
    <div className="space-y-6">
      {['owner', 'admin'].includes(userRole) && (
        <div className="flex justify-end">
          <TeamInviteControls
            onAdd={() => setIsAddDialogOpen(true)}
            onCopyInvite={copyInviteUrl}
            companyId={companyId}
          />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Team Members</CardTitle>
          {['owner', 'admin'].includes(userRole) && (
            <TeamMembersToolbar
              editMode={editMode}
              setEditMode={setEditMode}
              selectedCount={selectedMembers.length}
              onBulkDelete={handleBulkDelete}
              onAdd={() => setIsAddDialogOpen(true)}
            />
          )}
        </CardHeader>
        <CardContent>
          {['owner', 'admin'].includes(userRole) && (
            <TeamMembersTable 
              teamMembers={teamMembers} 
              userRole={userRole}
              editMode={editMode}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
            />
          )}
        </CardContent>
      </Card>

      {invitees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamInvitesTable invitees={invitees} copyInviteCode={copyInviteCode} />
          </CardContent>
        </Card>
      )}

      <MemberDialog 
        isOpen={isAddDialogOpen || isEditDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setCurrentMember(null);
        }}
        member={currentMember}
        onSave={handleSaveMemberWrapper}
        title={isEditDialogOpen ? "Edit Team Member" : "Add Team Member"}
        isLoading={isSaving}
      />

      <DeleteMemberDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TeamManagement;
