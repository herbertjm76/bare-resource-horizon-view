import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, ChevronsUpDown, Search } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { cn } from '@/lib/utils';

interface UnifiedAddProjectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingProjectIds?: string[];
  memberId?: string;
  weekStartDate?: string;
  showAllocationInput?: boolean;
  variant?: 'dialog' | 'popover';
  onProjectSelected?: (projectId: string) => void;
  onProjectCreated?: () => void;
  onAllocationAdded?: () => void;
  trigger?: React.ReactNode;
}

export const UnifiedAddProjectPopup: React.FC<UnifiedAddProjectPopupProps> = ({
  open,
  onOpenChange,
  existingProjectIds = [],
  memberId,
  weekStartDate,
  showAllocationInput = false,
  variant = 'dialog',
  onProjectSelected,
  onProjectCreated,
  onAllocationAdded,
  trigger,
}) => {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCountry, setNewProjectCountry] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const { projectDisplayPreference, displayPreference, workWeekHours } = useAppSettings();

  // Fetch available projects with department
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name, status, department')
        .eq('company_id', company?.id)
        .in('status', ['Active', 'In Progress', 'Planning'])
        .order('code', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id && open
  });

  // Get unique departments from projects
  const departments = useMemo(() => {
    const depts = new Set<string>();
    projects.forEach(p => {
      if (p.department) depts.add(p.department);
    });
    return Array.from(depts).sort();
  }, [projects]);

  // Fetch offices for new project creation
  const { data: offices = [] } = useQuery({
    queryKey: ['offices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offices')
        .select('id, name, country')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: showCreateNew
  });

  const createProjectMutation = useMutation({
    mutationFn: async ({ code, name, country }: { code: string; name: string; country?: string }) => {
      // Find office - use selected country or fallback to first available office
      let office = country ? offices.find(o => o.country === country) : offices[0];
      if (!office) {
        throw new Error('No office available. Please create an office first.');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          code: code.toUpperCase(),
          name,
          country: country || office.country,
          office_id: office.id,
          company_id: company?.id,
          status: 'Active',
          current_stage: 'Planning',
          target_profit_percentage: 20
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProjectId(data.id);
      setShowCreateNew(false);
      setNewProjectCode('');
      setNewProjectName('');
      setNewProjectCountry('');
      onProjectCreated?.();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
      console.error('Create project error:', error);
    }
  });

  const addAllocationMutation = useMutation({
    mutationFn: async ({ projectId, allocationHours }: { projectId: string; allocationHours: number }) => {
      if (!memberId || !weekStartDate) {
        throw new Error('Member ID and week start date are required for allocation');
      }
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .insert({
          resource_id: memberId,
          project_id: projectId,
          allocation_date: weekStartDate,
          hours: allocationHours,
          company_id: company?.id,
          resource_type: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Project allocation added');
      queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      resetAndClose();
      onAllocationAdded?.();
    },
    onError: (error) => {
      toast.error('Failed to add allocation');
      console.error('Add error:', error);
    }
  });

  const resetAndClose = () => {
    setSelectedProjectId('');
    setHours('');
    setShowCreateNew(false);
    setSelectedDepartment('all');
    setNewProjectCode('');
    setNewProjectName('');
    setNewProjectCountry('');
    onOpenChange(false);
  };

  const handleCreateProject = () => {
    if (!newProjectCode || !newProjectName) {
      toast.error('Please fill in project code and name');
      return;
    }
    createProjectMutation.mutate({ 
      code: newProjectCode, 
      name: newProjectName,
      country: newProjectCountry || undefined
    });
  };

  const handleAdd = () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    // If showing allocation input, validate and add allocation
    if (showAllocationInput) {
      const inputValue = parseFloat(hours);
      if (isNaN(inputValue) || inputValue <= 0) {
        toast.error(`Please enter a valid ${displayPreference === 'percentage' ? 'percentage' : 'hours'}`);
        return;
      }
      
      const capacity = workWeekHours || 40;
      const allocationHours = displayPreference === 'percentage' 
        ? (inputValue / 100) * capacity 
        : inputValue;
      
      addAllocationMutation.mutate({ projectId: selectedProjectId, allocationHours });
    } else {
      // Just select the project without allocation
      onProjectSelected?.(selectedProjectId);
      resetAndClose();
    }
  };

  // Filter available projects by department and exclude existing
  const availableProjects = useMemo(() => {
    const filtered = projects.filter(p => !existingProjectIds.includes(p.id));
    if (selectedDepartment === 'all') return filtered;
    return filtered.filter(p => p.department === selectedDepartment);
  }, [projects, existingProjectIds, selectedDepartment]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const dialogContent = (
    <div className="space-y-4">
      {!showCreateNew ? (
        <>
          {/* Department filter */}
          {departments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between"
                >
                  {selectedProject
                    ? getProjectDisplayName(selectedProject, projectDisplayPreference)
                    : "Search and select a project..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-background" align="start">
                <Command className="bg-background">
                  <CommandInput placeholder="Search projects..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {availableProjects.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={`${project.name} ${project.code}`}
                          onSelect={() => {
                            setSelectedProjectId(project.id);
                            setComboboxOpen(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{getProjectDisplayName(project, projectDisplayPreference)}</span>
                            {project.department && (
                              <span className="text-xs text-muted-foreground">{project.department}</span>
                            )}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedProjectId === project.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <button
              type="button"
              onClick={() => setShowCreateNew(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              or create a new project
            </button>
          </div>

          {showAllocationInput && (
            <div className="space-y-2">
              <Label htmlFor="hours">
                {displayPreference === 'percentage' ? 'Percentage' : 'Hours'}
              </Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder={displayPreference === 'percentage' ? 'Enter percentage (e.g. 50)' : 'Enter hours'}
                step={displayPreference === 'percentage' ? '5' : '0.5'}
                min="0"
                max={displayPreference === 'percentage' ? '100' : undefined}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Create New Project</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateNew(false)}
              >
                Back to Select
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectCode">Project Code *</Label>
              <Input
                id="projectCode"
                value={newProjectCode}
                onChange={(e) => setNewProjectCode(e.target.value)}
                placeholder="e.g., PRJ-001"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectCountry">Country <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Select value={newProjectCountry} onValueChange={setNewProjectCountry}>
                <SelectTrigger id="projectCountry">
                  <SelectValue placeholder="Select a country (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.country}>
                      {office.country} ({office.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending || !newProjectCode || !newProjectName}
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>

          {showAllocationInput && (
            <div className="border-t pt-4 space-y-2">
              <Label htmlFor="hours">
                {displayPreference === 'percentage' ? 'Percentage' : 'Hours'}
              </Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder={displayPreference === 'percentage' ? 'Enter percentage (e.g. 50)' : 'Enter hours'}
                step={displayPreference === 'percentage' ? '5' : '0.5'}
                min="0"
                max={displayPreference === 'percentage' ? '100' : undefined}
              />
            </div>
          )}
        </>
      )}
    </div>
  );

  if (variant === 'popover') {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4" align="start">
          <div className="space-y-4">
            <div className="font-medium">Add Project</div>
            {dialogContent}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={addAllocationMutation.isPending || !selectedProjectId || (showAllocationInput && !hours) || showCreateNew}
              >
                {addAllocationMutation.isPending ? 'Adding...' : showAllocationInput ? 'Add Allocation' : 'Add Project'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      {trigger && (
        <div onClick={() => onOpenChange(true)}>
          {trigger}
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>
              {showAllocationInput && weekStartDate
                ? `Add a new project allocation for the week starting ${weekStartDate}.`
                : 'Search for an existing project or create a new one.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {dialogContent}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addAllocationMutation.isPending || !selectedProjectId || (showAllocationInput && !hours) || showCreateNew}
            >
              {addAllocationMutation.isPending ? 'Adding...' : showAllocationInput ? 'Add Allocation' : 'Add Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
