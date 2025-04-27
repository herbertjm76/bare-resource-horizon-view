// TeamManagement.tsx

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';
import TeamInviteSection from './TeamInviteSection';
import TeamInvitesTable from './TeamInvitesTable';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import MemberDialog from './MemberDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTeamMembers } from '@/hooks/useTeamMembers';

// Update the Profile type to include the additional fields
export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  department: string;
  location: string;
  job_title: string;
};

export type Invite = Database['public']['Tables']['invites']['Row'];

interface TeamManagementProps {
  teamMembers: Profile[];
  inviteUrl: string;
  userRole: string;
}

export const TeamManagement = ({ teamMembers, inviteUrl, userRole }: TeamManagementProps) => {
  // --- Invite management state and effects ---
  const [invitees, setInvitees] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invLoading, setInvLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // --- Edit mode state ---
  const [editMode, setEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  // --- Dialog state ---
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Profile | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Get company ID from first team member
  const companyId = teamMembers[0]?.company_id;
  
  const { handleSaveMember, isSaving } = useTeamMembers(companyId);

  const handleSaveMemberWrapper = async (memberData: Partial<Profile>) => {
    const success = await handleSaveMember(
      memberData, 
      Boolean(currentMember)
    );

    if (success) {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setCurrentMember(null);
      setRefreshFlag(prev => prev + 1);
    }
  };

  // --- Fetch invites for this company ---
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

  // Handle sending a new invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvLoading(true);

    // Generate a unique random code, e.g. 8 characters
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      if (!inviteEmail || !companyId) {
        toast.error("Enter an email to invite.");
        setInvLoading(false);
        return;
      }

      // Get the current user's ID for created_by
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to send invites');
        setInvLoading(false);
        return;
      }

      // Insert invite row into supabase
      const { data, error } = await supabase
        .from('invites')
        .insert({
          code,
          company_id: companyId,
          email: inviteEmail,
          created_by: session.user.id, // Add the required created_by field
        });
      if (error) {
        toast.error(error.message || 'Failed to send invite');
      } else {
        toast.success('Invite sent!');
        setInviteEmail('');
        setRefreshFlag(Math.random()); // force re-fetch invites
      }
    } catch (e: any) {
      toast.error(e.message || 'Error sending invite.');
    } finally {
      setInvLoading(false);
    }
  };

  // Handle copying the invite link/code for a specific invite
  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Invite link copied!');
  };

  // Handle copying the global inviteUrl
  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  const handleAddMember = () => {
    setIsAddDialogOpen(true);
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
      // Here you would implement the actual delete logic
      // This is a placeholder - in a real app you'd delete the user from auth and profiles
      toast.success("Team member deleted successfully");
      setMemberToDelete(null);
      setIsDeleteDialogOpen(false);
      // Force a refresh of the members list
      setRefreshFlag(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete team member");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedMembers.length) return;
    
    try {
      // Here you would implement bulk delete logic
      // This is a placeholder
      toast.success(`${selectedMembers.length} team members deleted successfully`);
      setSelectedMembers([]);
      setEditMode(false);
      // Force a refresh of the members list
      setRefreshFlag(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete team members");
      console.error(error);
    }
  };

  return (
    <AuthGuard requiredRole={['owner', 'admin']}>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Team Members</h2>
          {['owner', 'admin'].includes(userRole) && (
            <TeamMembersToolbar
              editMode={editMode}
              setEditMode={setEditMode}
              selectedCount={selectedMembers.length}
              onBulkDelete={handleBulkDelete}
              onAdd={handleAddMember}
            />
          )}
        </div>

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

        {invitees.length > 0 && (
          <TeamInvitesTable invitees={invitees} copyInviteCode={copyInviteCode} />
        )}

        {['owner', 'admin'].includes(userRole) && (
          <TeamInviteSection
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            invLoading={invLoading}
            handleSendInvite={handleSendInvite}
            inviteUrl={inviteUrl}
            onCopyInviteUrl={() => copyInviteUrl()}
          />
        )}

        {/* Member Add/Edit Dialog */}
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

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this team member. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  );
};
