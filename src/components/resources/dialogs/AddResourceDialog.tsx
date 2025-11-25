
import React, { useState, useMemo } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useResourceOptions } from './useResourceOptions';
import { useAddResource } from './useAddResource';
import { ResourceSelectOption } from './ResourceSelectOption';

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string, role?: string, isPending?: boolean }) => void;
}

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  projectId, 
  onClose, 
  onAdd
}) => {
  const { resourceOptions, loading: optionsLoading } = useResourceOptions();
  const { 
    selectedResource, 
    loading: addLoading, 
    setSelectedResource, 
    handleAdd 
  } = useAddResource({ projectId, onAdd, onClose });
  
  const [filterType, setFilterType] = useState<'all' | 'active' | 'pre-registered'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'role'>('name');

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    let filtered = resourceOptions;
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        const roleA = a.role || '';
        const roleB = b.role || '';
        return roleA.localeCompare(roleB);
      }
    });
    
    return sorted;
  }, [resourceOptions, filterType, sortBy]);

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
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>
                    {optionsLoading ? 'Loading...' : 'No team members found'}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredAndSortedResources.map(member => (
                      <CommandItem
                        key={member.id}
                        value={`${member.name} ${member.role || ''}`}
                        onSelect={() => setSelectedResource(member.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0",
                              selectedResource === member.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <ResourceSelectOption member={member} />
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
          <Button 
            isLoading={addLoading} 
            onClick={handleAdd} 
            disabled={!selectedResource || addLoading || optionsLoading}
          >
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
