
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import { TeamMembersFilters } from './TeamMembersFilters';
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
  
  // Filter state
  const [filters, setFilters] = useState({
    department: 'all',
    location: 'all',
    searchTerm: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      department: 'all',
      location: 'all',
      searchTerm: ''
    });
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.department !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  // Filter team members based on active filters
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter(member => {
      // Department filter
      if (filters.department !== 'all' && member.department !== filters.department) {
        return false;
      }
      
      // Location filter
      if (filters.location !== 'all' && member.location !== filters.location) {
        return false;
      }
      
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const email = (member.email || '').toLowerCase();
        const jobTitle = (member.job_title || '').toLowerCase();
        
        if (!fullName.includes(searchLower) && 
            !email.includes(searchLower) && 
            !jobTitle.includes(searchLower)) {
          return false;
        }
      }
      
      return true;
    });
  }, [teamMembers, filters]);

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

    // Separate active and pending members
    const activeIds: string[] = [];
    const pendingIds: string[] = [];
    
    changedMemberIds.forEach((memberId) => {
      const member = teamMembers.find((m) => m.id === memberId);
      const isPending = member && 'isPending' in member && (member as any).isPending;
      if (isPending) {
        pendingIds.push(memberId);
      } else {
        activeIds.push(memberId);
      }
    });

    setIsSaving(true);
    try {
      const savePromises = [];
      
      // Update active members in profiles table
      activeIds.forEach((memberId) => {
        savePromises.push(
          supabase
            .from('profiles')
            .update(pendingChanges[memberId])
            .eq('id', memberId)
        );
      });
      
      // Update pending members in invites table
      pendingIds.forEach((memberId) => {
        savePromises.push(
          supabase
            .from('invites')
            .update(pendingChanges[memberId])
            .eq('id', memberId)
        );
      });

      const results = await Promise.all(savePromises);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        console.error('Errors:', errors);
        throw new Error(`Failed to update ${errors.length} member(s)`);
      }

      const totalUpdated = activeIds.length + pendingIds.length;
      toast.success(`Successfully updated ${totalUpdated} member(s)`);
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
        <CardTitle className="text-lg font-medium">Team Members</CardTitle>
        {['owner', 'admin'].includes(userRole) && (
          <TeamMembersToolbar 
            editMode={editMode} 
            setEditMode={setEditMode} 
            selectedCount={selectedMembers.length}
            selectedMemberIds={selectedMembers}
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
        {['owner', 'admin'].includes(userRole) && (
          <TeamMembersFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
          />
        )}
        <TeamMembersTable 
          teamMembers={filteredTeamMembers} 
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
