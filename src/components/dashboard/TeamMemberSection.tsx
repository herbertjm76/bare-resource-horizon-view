
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import { TeamMember } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  onRefresh?: () => void;
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
  onAdd,
  onRefresh
}) => {
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<TeamMember>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (memberId: string, field: string, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    const changedMemberIds = Object.keys(pendingChanges);
    if (changedMemberIds.length === 0) {
      setEditMode(false);
      return;
    }

    // Only update active (registered) members for now
    const profileIdsToUpdate = changedMemberIds.filter((memberId) => {
      const member = teamMembers.find((m) => m.id === memberId);
      const isPending = member && 'isPending' in member && (member as any).isPending;
      return !isPending;
    });

    if (profileIdsToUpdate.length === 0) {
      toast.error('Bulk editing is currently only supported for registered members.');
      setPendingChanges({});
      setEditMode(false);
      return;
    }

    const skippedCount = changedMemberIds.length - profileIdsToUpdate.length;

    setIsSaving(true);
    try {
      const savePromises = profileIdsToUpdate.map((memberId) =>
        supabase
          .from('profiles')
          .update(pendingChanges[memberId])
          .eq('id', memberId)
      );

      const results = await Promise.all(savePromises);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        console.error('Errors:', errors);
        throw new Error(`Failed to update ${errors.length} member(s)`);
      }

      const updatedCount = profileIdsToUpdate.length;
      const message =
        skippedCount > 0
          ? `Updated ${updatedCount} member(s). Pending invites were not updated.`
          : `Successfully updated ${updatedCount} member(s)`;

      toast.success(message);
      setPendingChanges({});
      setEditMode(false);

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error('Failed to save changes');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setPendingChanges({});
    setEditMode(false);
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

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
            onImportComplete={onRefresh}
            onSaveAll={handleSaveAll}
            onCancelEdit={handleCancelEdit}
            hasChanges={hasChanges}
            isSaving={isSaving}
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
          onRefresh={onRefresh}
          pendingChanges={pendingChanges}
          onFieldChange={handleFieldChange}
        />
      </CardContent>
    </Card>
  );
};

export default TeamMemberSection;
