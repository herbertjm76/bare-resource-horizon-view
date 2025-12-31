
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import { TeamMembersFilters } from './TeamMembersFilters';
import { TeamMember } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

interface TeamMemberSectionProps {
  teamMembers: TeamMember[];
  userRole: string;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: string) => void;
  onSendInvite?: (member: TeamMember) => void;
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
  onSendInvite,
  onBulkDelete,
  onAdd,
  onRefresh
}) => {
  const { isAdmin } = usePermissions();
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<TeamMember>>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    practiceArea: 'all',
    department: 'all',
    location: 'all',
    searchTerm: ''
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState<'name' | 'created_date' | 'none'>('none');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      practiceArea: 'all',
      department: 'all',
      location: 'all',
      searchTerm: ''
    });
    setSortBy('none');
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.practiceArea !== 'all') count++;
    if (filters.department !== 'all') count++;
    if (filters.location !== 'all') count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);

  // Filter team members based on active filters
  const filteredTeamMembers = useMemo(() => {
    let filtered = teamMembers.filter(member => {
      // Practice Area filter - Note: Currently practice areas are associated with projects,
      // not directly with team members. To implement this properly, you would need
      // to fetch project allocations and filter based on project practice areas.
      // For now, this filter won't have an effect unless you add practice area data to profiles.
      if (filters.practiceArea !== 'all') {
        // Placeholder for practice area filtering
        // You may want to add a practice area field to the profiles table
        // or filter based on project allocations
      }
      
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
    
    // Apply sorting
    if (sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === 'created_date') {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'name') {
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
          return sortDirection === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return 0;
      });
    }
    
    return filtered;
  }, [teamMembers, filters, sortBy, sortDirection]);

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
      const savePromises: any[] = [];

      // Update active members (profiles + user_roles)
      activeIds.forEach((memberId) => {
        const changes = pendingChanges[memberId] || {};
        const { role, ...profileChanges } = changes as any;

        // Never write role into profiles (role lives in user_roles)
        if (Object.keys(profileChanges).length > 0) {
          savePromises.push(
            supabase
              .from('profiles')
              .update(profileChanges)
              .eq('id', memberId)
          );
        }

        if (role) {
          const member = teamMembers.find((m) => m.id === memberId);
          const companyId = member?.company_id;

          if (!companyId) {
            savePromises.push(Promise.resolve({ error: new Error('Missing company_id for role update') }));
            return;
          }

          // Replace role in user_roles for that company
          savePromises.push(
            (async () => {
              const del = await supabase
                .from('user_roles')
                .delete()
                .eq('user_id', memberId)
                .eq('company_id', companyId);

              if (del.error) return del;

              const ins = await supabase
                .from('user_roles')
                .insert({ user_id: memberId, company_id: companyId, role: role as any });

              return ins;
            })()
          );
        }
      });

      // Update pending members in invites table (role is a column there)
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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <CardTitle className="text-base sm:text-lg font-medium">Team Members</CardTitle>
        {isAdmin && (
          <TeamMembersToolbar 
            editMode={editMode} 
            setEditMode={setEditMode} 
            selectedCount={selectedMembers.length}
            selectedMemberIds={selectedMembers}
            onBulkDelete={onBulkDelete} 
            onAdd={onAdd}
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
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={setSortBy}
            onSortDirectionChange={setSortDirection}
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
          onSendInvite={onSendInvite}
          onRefresh={onRefresh}
          pendingChanges={pendingChanges}
          onFieldChange={handleFieldChange}
        />
      </CardContent>
    </Card>
  );
};

export default TeamMemberSection;
