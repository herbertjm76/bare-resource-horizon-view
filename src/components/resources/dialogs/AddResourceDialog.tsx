
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
import { useOfficeSettings } from '@/context/officeSettings';

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
  const { departments: officeDepartments } = useOfficeSettings();
  const { 
    selectedResource, 
    loading: addLoading, 
    setSelectedResource, 
    handleAdd 
  } = useAddResource({ projectId, onAdd, onClose });
  
  const [filterBy, setFilterBy] = useState<'all' | 'department' | 'role'>('all');
  const [filterValue, setFilterValue] = useState<string>('all');

  // Get departments from office settings
  const departments = useMemo(() => 
    ['all', ...officeDepartments.map(d => d.name)],
    [officeDepartments]
  );
  
  // Get unique roles from resource options
  const roles = useMemo(() => 
    ['all', ...new Set(resourceOptions.map(r => r.role).filter(Boolean))],
    [resourceOptions]
  );

  // Filter resources
  const filteredResources = useMemo(() => {
    if (filterBy === 'all' || filterValue === 'all') return resourceOptions;
    
    return resourceOptions.filter(r => {
      if (filterBy === 'department') return r.department === filterValue;
      if (filterBy === 'role') return r.role === filterValue;
      return true;
    });
  }, [resourceOptions, filterBy, filterValue]);

  const selectedResourceData = resourceOptions.find(r => r.id === selectedResource);
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Resource to Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Filter Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Filter By</Label>
              <Select value={filterBy} onValueChange={(value: any) => {
                setFilterBy(value);
                setFilterValue('all');
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{filterBy === 'department' ? 'Department' : filterBy === 'role' ? 'Role' : 'Value'}</Label>
              <Select 
                value={filterValue} 
                onValueChange={setFilterValue}
                disabled={filterBy === 'all'}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterBy === 'department' && departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept === 'all' ? 'All' : dept}</SelectItem>
                  ))}
                  {filterBy === 'role' && roles.map(role => (
                    <SelectItem key={role} value={role}>{role === 'all' ? 'All' : role}</SelectItem>
                  ))}
                  {filterBy === 'all' && <SelectItem value="all">All</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Searchable Resource Grid */}
          <div className="space-y-2">
            <Label>Team Member</Label>
            <div className="border rounded-md">
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty>
                    {optionsLoading ? 'Loading...' : 'No team members found'}
                  </CommandEmpty>
                  <CommandGroup>
                    <div className="grid grid-cols-5 gap-3 p-3">
                      {filteredResources.map(member => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedResource(member.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
                            "hover:bg-accent",
                            selectedResource === member.id && "bg-accent ring-2 ring-primary"
                          )}
                        >
                          <ResourceSelectOption member={member} isSelected={selectedResource === member.id} />
                        </div>
                      ))}
                    </div>
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
