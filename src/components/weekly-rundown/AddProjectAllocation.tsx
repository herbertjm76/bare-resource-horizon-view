import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, ChevronsUpDown } from 'lucide-react';
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

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { cn } from '@/lib/utils';

interface AddProjectAllocationProps {
  memberId: string;
  weekStartDate: string;
  existingProjectIds: string[];
  onAdd: () => void;
}

export const AddProjectAllocation: React.FC<AddProjectAllocationProps> = ({
  memberId,
  weekStartDate,
  existingProjectIds,
  onAdd
}) => {
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCountry, setNewProjectCountry] = useState('');
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const { projectDisplayPreference, displayPreference, workWeekHours } = useAppSettings();

  // Fetch available projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name, status')
        .eq('company_id', company?.id)
        .order('code', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id && open
  });

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
    mutationFn: async ({ code, name, country }: { code: string; name: string; country: string }) => {
      // Find the office that matches the country
      const office = offices.find(o => o.country === country);
      if (!office) {
        throw new Error('Please select a valid country');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          code: code.toUpperCase(),
          name,
          country,
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
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create project');
      console.error('Create project error:', error);
    }
  });

  const addMutation = useMutation({
    mutationFn: async ({ projectId, allocationHours }: { projectId: string; allocationHours: number }) => {
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
      setOpen(false);
      setSelectedProjectId('');
      setHours('');
      setShowCreateNew(false);
      onAdd();
    },
    onError: (error) => {
      toast.error('Failed to add allocation');
      console.error('Add error:', error);
    }
  });

  const handleCreateProject = () => {
    if (!newProjectCode || !newProjectName || !newProjectCountry) {
      toast.error('Please fill in all project fields');
      return;
    }
    createProjectMutation.mutate({ 
      code: newProjectCode, 
      name: newProjectName,
      country: newProjectCountry
    });
  };

  const handleAdd = () => {
    const inputValue = parseFloat(hours);
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }
    if (isNaN(inputValue) || inputValue <= 0) {
      toast.error(`Please enter a valid ${displayPreference === 'percentage' ? 'percentage' : 'hours'}`);
      return;
    }
    
    // Convert percentage to hours if needed
    const capacity = workWeekHours || 40;
    const allocationHours = displayPreference === 'percentage' 
      ? (inputValue / 100) * capacity 
      : inputValue;
    
    addMutation.mutate({ projectId: selectedProjectId, allocationHours });
  };

  const availableProjects = projects.filter(p => !existingProjectIds.includes(p.id));

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="glass hover:glass-elevated"
      >
        <Plus className="h-3 w-3 mr-1.5" />
        Add Project
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project Allocation</DialogTitle>
            <DialogDescription>
              Add a new project allocation for this team member for the week starting {weekStartDate}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!showCreateNew ? (
              <>
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
                        {selectedProjectId
                          ? availableProjects.find((project) => project.id === selectedProjectId)?.name || "Select a project"
                          : "Select a project"}
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
                                {getProjectDisplayName(project, projectDisplayPreference)}
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
                    <Label htmlFor="projectCountry">Country *</Label>
                    <Select value={newProjectCountry} onValueChange={setNewProjectCountry}>
                      <SelectTrigger id="projectCountry">
                        <SelectValue placeholder="Select a country" />
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
                    disabled={createProjectMutation.isPending || !newProjectCode || !newProjectName || !newProjectCountry}
                  >
                    {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>

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
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setShowCreateNew(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addMutation.isPending || !selectedProjectId || !hours || showCreateNew}
            >
              {addMutation.isPending ? 'Adding...' : 'Add Allocation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
