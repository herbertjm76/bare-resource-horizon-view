
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
import { Check, X, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useResourceOptions } from './useResourceOptions';
import { useAddResource } from './useAddResource';
import { ResourceSelectOption } from './ResourceSelectOption';
import { useOfficeSettings } from '@/context/officeSettings';
import { useOfficeRoles } from '@/hooks/useOfficeRoles';

interface AddResourceDialogProps {
  projectId: string;
  onClose: () => void;
  onAdd: (resource: { staffId: string, name: string, role?: string, isPending?: boolean, isRole?: boolean }) => void;
}

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ 
  projectId, 
  onClose, 
  onAdd
}) => {
  const { resourceOptions, loading: optionsLoading } = useResourceOptions();
  const { data: officeRoles = [], isLoading: rolesLoading } = useOfficeRoles();
  const { departments: officeDepartments, practice_areas: officePracticeAreas } = useOfficeSettings();
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState<'person' | 'role'>('person');
  
  const [filterBy, setFilterBy] = useState<'all' | 'department' | 'practice_area'>('all');
  const [filterValue, setFilterValue] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleSearchTerm, setRoleSearchTerm] = useState<string>('');

  // Get departments from office settings
  const departments = useMemo(() => 
    ['all', ...officeDepartments.map(d => d.name)],
    [officeDepartments]
  );
  
  // Get practice areas from office settings
  const practiceAreas = useMemo(() => 
    ['all', ...officePracticeAreas.map(p => p.name)],
    [officePracticeAreas]
  );

  // Filter resources (persons)
  const filteredResources = useMemo(() => {
    let filtered = resourceOptions;
    
    // Apply filter by department or practice area
    if (filterBy !== 'all' && filterValue !== 'all') {
      filtered = filtered.filter(r => {
        if (filterBy === 'department') return r.department === filterValue;
        if (filterBy === 'practice_area') return r.role === filterValue;
        return true;
      });
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
    
    return filtered;
  }, [resourceOptions, filterBy, filterValue, searchTerm]);

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!roleSearchTerm.trim()) return officeRoles;
    const searchLower = roleSearchTerm.toLowerCase().trim();
    return officeRoles.filter(role => 
      role.name.toLowerCase().includes(searchLower)
    );
  }, [officeRoles, roleSearchTerm]);

  const selectedResourcesData = resourceOptions.filter(r => selectedResources.includes(r.id));
  const selectedRolesData = officeRoles.filter(r => selectedRoles.includes(r.id));
  
  const toggleResourceSelection = (resourceId: string) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };
  
  const handleAddMultiple = async () => {
    const itemsToAdd = resourceType === 'person' ? selectedResources : selectedRoles;
    if (itemsToAdd.length === 0) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (resourceType === 'person') {
        // Add all selected resources one by one
        for (const resourceId of selectedResources) {
          const resource = resourceOptions.find(r => r.id === resourceId);
          if (!resource) continue;
          
          await Promise.resolve(onAdd({ 
            staffId: resource.id, 
            name: resource.name,
            role: resource.role,
            isPending: resource.type === 'pre-registered',
            isRole: false
          }));
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } else {
        // Add all selected roles
        for (const roleId of selectedRoles) {
          const role = officeRoles.find(r => r.id === roleId);
          if (!role) continue;
          
          await Promise.resolve(onAdd({ 
            staffId: role.id, 
            name: role.name,
            role: role.name,
            isPending: false,
            isRole: true
          }));
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error adding resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = resourceType === 'person' ? optionsLoading : rolesLoading;
  const selectedCount = resourceType === 'person' ? selectedResources.length : selectedRoles.length;
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Resource to Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Resource Type Toggle */}
          <div className="space-y-2">
            <Label>Resource Type</Label>
            <Tabs value={resourceType} onValueChange={(v) => setResourceType(v as 'person' | 'role')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="person" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Person
                </TabsTrigger>
                <TabsTrigger value="role" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {resourceType === 'person' ? (
            <>
              {/* Filter Controls for Person */}
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
                      <SelectItem value="practice_area">Practice Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{filterBy === 'department' ? 'Department' : filterBy === 'practice_area' ? 'Practice Area' : 'Value'}</Label>
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
                      {filterBy === 'practice_area' && practiceAreas.map(area => (
                        <SelectItem key={area} value={area}>{area === 'all' ? 'All' : area}</SelectItem>
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
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search team members..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>
                        {optionsLoading ? 'Loading...' : 'No team members found'}
                      </CommandEmpty>
                      <CommandGroup>
                        <div className="grid grid-cols-5 gap-3 p-3">
                          {filteredResources.map(member => (
                            <div
                              key={member.id}
                              onClick={() => toggleResourceSelection(member.id)}
                              className={cn(
                                "flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer transition-all relative",
                                "hover:bg-accent",
                                selectedResources.includes(member.id) && "bg-accent ring-2 ring-primary"
                              )}
                            >
                              {selectedResources.includes(member.id) && (
                                <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                              <ResourceSelectOption member={member} isSelected={selectedResources.includes(member.id)} />
                            </div>
                          ))}
                        </div>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
                {selectedResourcesData.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Selected ({selectedResourcesData.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedResourcesData.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => toggleResourceSelection(r.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs text-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <span className="max-w-[140px] truncate" title={r.name}>{r.name}</span>
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="border rounded-md">
                  <Command shouldFilter={false}>
                    <CommandInput 
                      placeholder="Search roles..." 
                      value={roleSearchTerm}
                      onValueChange={setRoleSearchTerm}
                    />
                    <CommandList className="max-h-[300px]">
                      <CommandEmpty>
                        {rolesLoading ? 'Loading...' : 'No roles found'}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredRoles.map(role => (
                          <CommandItem
                            key={role.id}
                            value={role.id}
                            onSelect={() => toggleRoleSelection(role.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    selectedRoles.includes(role.id) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{role.name}</span>
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
                {selectedRolesData.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Selected ({selectedRolesData.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRolesData.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => toggleRoleSelection(r.id)}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs text-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="max-w-[140px] truncate" title={r.name}>{r.name}</span>
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            isLoading={loading} 
            onClick={handleAddMultiple} 
            disabled={selectedCount === 0 || loading || isLoading}
          >
            Add {selectedCount > 0 ? `${selectedCount} ` : ''}{resourceType === 'role' ? 'Role' : 'Resource'}{selectedCount !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
