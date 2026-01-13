
import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invite = Database['public']['Tables']['invites']['Row'];

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string, role?: string, isPending?: boolean }) => void;
}

type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
  department?: string;
  location?: string;
};

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  projectId, 
  onClose, 
  onAdd
}) => {
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'pre-registered'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'role'>('name');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { company } = useCompany();
  
  // Fetch team members and pre-registered invites when dialog opens
  useEffect(() => {
    const fetchResources = async () => {
      if (!company?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch active team members from profiles
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id);
          
        if (activeError) throw activeError;
        
        // Fetch pre-registered team members from invites (both types)
        const { data: preregisteredMembers, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', company.id)
          .in('invitation_type', ['pre_registered', 'email_invite'])
          .eq('status', 'pending');
          
        if (inviteError) throw inviteError;
        
        // Combine and format the resources
        const formattedResources: ResourceOption[] = [
          // Active members
          ...(activeMembers || []).map((member: Profile) => ({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            email: member.email,
            type: 'active' as const,
            role: member.job_title,
            department: member.department || undefined,
            location: member.location || undefined
          })),
          
          // Pre-registered members
          ...(preregisteredMembers || []).map((invite: Invite) => ({
            id: invite.id,
            name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
            email: invite.email || '',
            type: 'pre-registered' as const,
            role: invite.job_title,
            department: invite.department || undefined,
            location: invite.location || undefined
          }))
        ];
        
        setResourceOptions(formattedResources);
      } catch (err: any) {
        console.error('Error fetching resources:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [company]);

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    let filtered = resourceOptions;
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        (r.role && r.role.toLowerCase().includes(searchLower)) ||
        (r.department && r.department.toLowerCase().includes(searchLower)) ||
        (r.location && r.location.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by role
        const roleA = a.role || '';
        const roleB = b.role || '';
        return roleA.localeCompare(roleB);
      }
    });
    
    return sorted;
  }, [resourceOptions, filterType, sortBy, searchTerm]);
  
  const handleAdd = async () => {
    if (!selectedResource || !company?.id || !projectId) {
      toast.error('Please select a resource and try again');
      return;
    }
    
    setLoading(true);
    
    try {
      const resource = resourceOptions.find(r => r.id === selectedResource);
      if (!resource) throw new Error('Resource not found');
      
      logger.debug('Adding resource:', { 
        resource,
        projectId,
        companyId: company.id,
        type: resource.type 
      });
      
      if (resource.type === 'pre-registered') {
        // Handle pre-registered resource (store in pending_resources)
        const { data, error } = await supabase
          .from('pending_resources')
          .insert({
            invite_id: resource.id,
            project_id: projectId,
            company_id: company.id,
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding pending resource:', error);
          throw error;
        }
        
        logger.debug('Added pending resource:', data);
      } else {
        // Add active resource - explicitly include company_id
        const { data, error } = await supabase
          .from('project_resources')
          .insert({
            staff_id: resource.id,
            project_id: projectId,
            company_id: company.id,
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding active resource:', error);
          throw error;
        }
        
        logger.debug('Added active resource:', data);
      }
      
      // Call the onAdd callback with the resource details
      onAdd({ 
        staffId: resource.id, 
        name: resource.name,
        role: resource.role,
        isPending: resource.type === 'pre-registered'
      });
      
      toast.success(`${resource.name} added to project`);
      onClose();
    } catch (err: any) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource: ' + (err.message || err.error_description || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  const selectedResourceData = resourceOptions.find(r => r.id === selectedResource);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Resource to Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Filter and Sort Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Filter by Type</Label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="pre-registered">Pending Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Searchable Resource List */}
          <div className="space-y-2">
            <Label>Team Member</Label>
            <div className="border rounded-md">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search team members..." 
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>
                    {loading ? 'Loading...' : 'No team members found'}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredAndSortedResources.map(member => (
                      <CommandItem
                        key={member.id}
                        value={member.id}
                        onSelect={() => setSelectedResource(member.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedResource === member.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                              {member.role && (
                                <span className="text-xs text-muted-foreground">{member.role}</span>
                              )}
                            </div>
                          </div>
                          {member.type === 'pre-registered' && (
                            <StandardizedBadge variant="warning" size="sm">
                              Pending
                            </StandardizedBadge>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            {selectedResourceData && (
              <div className="text-sm text-muted-foreground mt-2">
                Selected: <span className="font-medium text-foreground">{selectedResourceData.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button isLoading={loading} onClick={handleAdd} disabled={!selectedResource || loading}>
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
