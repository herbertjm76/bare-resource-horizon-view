
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMembersTable from './TeamMembersTable';
import TeamMembersToolbar from './TeamMembersToolbar';
import { TeamMembersFilters } from './TeamMembersFilters';
import { TeamMember } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';

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

  // Separate registered and pending members
  const { registeredMembers, pendingMembers } = useMemo(() => {
    const registered: TeamMember[] = [];
    const pending: TeamMember[] = [];
    
    teamMembers.forEach(member => {
      const isPending = 'isPending' in member && member.isPending;
      if (isPending) {
        pending.push(member);
      } else {
        registered.push(member);
      }
    });
    
    return { registeredMembers: registered, pendingMembers: pending };
  }, [teamMembers]);

  // Apply filters to both groups
  const applyFilters = (members: TeamMember[]) => {
    let filtered = members.filter(member => {
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
  };

  const filteredRegisteredMembers = useMemo(() => applyFilters(registeredMembers), [registeredMembers, filters, sortBy, sortDirection]);
  const filteredPendingMembers = useMemo(() => applyFilters(pendingMembers), [pendingMembers, filters, sortBy, sortDirection]);

  // Get selected pending member IDs only (for send invites)
  const selectedPendingMemberIds = useMemo(() => {
    return selectedMembers.filter(id => 
      pendingMembers.some(m => m.id === id)
    );
  }, [selectedMembers, pendingMembers]);

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
    setSelectedMembers([]);
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
            selectedMemberIds={selectedPendingMemberIds}
            selectedPendingCount={selectedPendingMemberIds.length}
            onBulkDelete={onBulkDelete} 
            onAdd={onAdd}
            onSaveAll={handleSaveAll}
            onCancelEdit={handleCancelEdit}
            hasChanges={hasChanges}
            isSaving={isSaving}
          />
        )}
      </CardHeader>
      <CardContent className="space-y-6">
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
        
        {/* Registered Members Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-medium text-foreground">Registered Members</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {filteredRegisteredMembers.length}
            </Badge>
          </div>
          {filteredRegisteredMembers.length > 0 ? (
            <TeamMembersTable
              teamMembers={filteredRegisteredMembers} 
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
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No registered members found.</p>
          )}
        </div>

        {/* Pending Invites Section */}
        {(filteredPendingMembers.length > 0 || pendingMembers.length > 0) && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-medium text-foreground">Pending Invites</h3>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                {filteredPendingMembers.length}
              </Badge>
            </div>
            {filteredPendingMembers.length > 0 ? (
              <TeamMembersTable
                teamMembers={filteredPendingMembers} 
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
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No pending invites match the current filters.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberSection;
