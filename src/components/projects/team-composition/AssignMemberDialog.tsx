import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, User, UserCheck, X } from 'lucide-react';
import { useResourceOptions } from '@/components/resources/dialogs/useResourceOptions';

interface AssignMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (memberId: string, memberName: string) => void;
  roleId?: string;
  roleName?: string;
  currentAssignedId?: string | null;
}

export const AssignMemberDialog: React.FC<AssignMemberDialogProps> = ({
  isOpen,
  onClose,
  onAssign,
  roleId,
  roleName,
  currentAssignedId,
}) => {
  const [search, setSearch] = useState('');
  const { resourceOptions, loading } = useResourceOptions();

  // Filter to only show members (not roles)
  const members = useMemo(() => {
    return resourceOptions.filter(r => r.type === 'active' || r.type === 'pre-registered');
  }, [resourceOptions]);

  // Filter members by search and optionally by role
  const filteredMembers = useMemo(() => {
    let filtered = members;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.email?.toLowerCase().includes(searchLower) ||
        m.role?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [members, search]);

  // Members matching the role
  const matchingRoleMembers = useMemo(() => {
    if (!roleId) return [];
    return filteredMembers.filter(m => m.officeRoleId === roleId);
  }, [filteredMembers, roleId]);

  // Other members
  const otherMembers = useMemo(() => {
    if (!roleId) return filteredMembers;
    return filteredMembers.filter(m => m.officeRoleId !== roleId);
  }, [filteredMembers, roleId]);

  const handleSelect = (member: typeof members[0]) => {
    onAssign(member.id, member.name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Team Member</DialogTitle>
          <DialogDescription>
            {roleName 
              ? `Select a team member to assign to the ${roleName} role allocation.`
              : 'Select a team member to assign to this allocation.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members list */}
          <ScrollArea className="h-[300px] border rounded-md">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading team members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No team members found
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {/* Matching role members first */}
                {matchingRoleMembers.length > 0 && roleId && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Matching Role
                    </div>
                    {matchingRoleMembers.map((member) => (
                      <MemberItem
                        key={member.id}
                        member={member}
                        isCurrentlyAssigned={member.id === currentAssignedId}
                        onSelect={() => handleSelect(member)}
                      />
                    ))}
                  </>
                )}

                {/* Other members */}
                {otherMembers.length > 0 && (
                  <>
                    {matchingRoleMembers.length > 0 && roleId && (
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                        Other Team Members
                      </div>
                    )}
                    {otherMembers.map((member) => (
                      <MemberItem
                        key={member.id}
                        member={member}
                        isCurrentlyAssigned={member.id === currentAssignedId}
                        onSelect={() => handleSelect(member)}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Unassign button if currently assigned */}
          {currentAssignedId && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onAssign('', '');
                onClose();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Remove Assignment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MemberItemProps {
  member: {
    id: string;
    name: string;
    email?: string;
    type: string;
    role?: string;
  };
  isCurrentlyAssigned: boolean;
  onSelect: () => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, isCurrentlyAssigned, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
        isCurrentlyAssigned 
          ? 'bg-primary/10 border border-primary/20' 
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex-shrink-0">
        {member.type === 'pre-registered' ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <UserCheck className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{member.name}</div>
        {member.role && (
          <div className="text-xs text-muted-foreground truncate">{member.role}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {member.type === 'pre-registered' && (
          <Badge variant="outline" className="text-xs">Pending</Badge>
        )}
        {isCurrentlyAssigned && (
          <Badge variant="secondary" className="text-xs">Current</Badge>
        )}
      </div>
    </button>
  );
};

