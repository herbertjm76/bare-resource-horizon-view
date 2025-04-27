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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { Copy, UserPlus } from 'lucide-react';

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
  const [invitees, setInvitees] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invLoading, setInvLoading] = useState(false);
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

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvLoading(true);

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      if (!inviteEmail || !companyId) {
        toast.error("Enter an email to invite.");
        setInvLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('You must be logged in to send invites');
        setInvLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('invites')
        .insert({
          code,
          company_id: companyId,
          email: inviteEmail,
          created_by: session.user.id,
        });
      if (error) {
        toast.error(error.message || 'Failed to send invite');
      } else {
        toast.success('Invite sent!');
        setInviteEmail('');
        setRefreshFlag(Math.random());
      }
    } catch (e: any) {
      toast.error(e.message || 'Error sending invite.');
    } finally {
      setInvLoading(false);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${code}`);
    toast.success('Invite link copied!');
  };

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

  return (
    <AuthGuard requiredRole={['owner', 'admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground">Team Members</h2>
          {['owner', 'admin'].includes(userRole) && (
            <div className="flex gap-2">
              <Button onClick={handleAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
              <Button variant="outline" onClick={() => copyInviteUrl()}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Invite Link
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-medium">Active Members</CardTitle>
            {['owner', 'admin'].includes(userRole) && (
              <TeamMembersToolbar
                editMode={editMode}
                setEditMode={setEditMode}
                selectedCount={selectedMembers.length}
                onBulkDelete={handleBulkDelete}
                onAdd={handleAddMember}
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
