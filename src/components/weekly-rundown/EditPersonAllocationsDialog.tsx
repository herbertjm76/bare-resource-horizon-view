import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';
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
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Building2, Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { cn } from '@/lib/utils';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import {
  getAllocationInputConfig,
  hoursToInputDisplay,
  parseInputToHours,
} from '@/utils/allocationInput';

interface EditPersonAllocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: any;
  projectId?: string;
  selectedWeek: Date;
}

export const EditPersonAllocationsDialog: React.FC<EditPersonAllocationsDialogProps> = ({
  open,
  onOpenChange,
  person,
  projectId,
  selectedWeek
}) => {
  const [hours, setHours] = useState<Record<string, string>>({});
  const [showAddProject, setShowAddProject] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedNewProjectId, setSelectedNewProjectId] = useState<string>('');
  const [newAllocationHours, setNewAllocationHours] = useState<string>('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCountry, setNewProjectCountry] = useState('');
  const { projectDisplayPreference, startOfWorkWeek, displayPreference, workWeekHours } = useAppSettings();
  const weekStart = getWeekStartDate(selectedWeek, startOfWorkWeek);
  const weekKey = format(weekStart, 'yyyy-MM-dd');
  const { company } = useCompany();
  const queryClient = useQueryClient();
  // Phase 5: Use consistent capacity source - prefer person's weekly_capacity
  const capacity = person.weekly_capacity || person.capacity || workWeekHours || 40;
  const inputConfig = getAllocationInputConfig(displayPreference, capacity);


  // Pre-populate hours state when dialog opens with current values
  React.useEffect(() => {
    if (open && person.projects?.length > 0) {
      const initialHours: Record<string, string> = {};
      person.projects.forEach((project: any) => {
        initialHours[project.id] = hoursToInputDisplay(project.hours, capacity, displayPreference);
      });
      setHours(initialHours);
    } else if (!open) {
      setHours({});
    }
  }, [open, person.projects, displayPreference, capacity]);

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
    enabled: !!company?.id && open && showAddProject
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

  const existingProjectIds = person.projects?.map((p: any) => p.id) || [];
  const availableProjects = projects.filter(p => !existingProjectIds.includes(p.id));

  const createProjectMutation = useMutation({
    mutationFn: async ({ code, name, country }: { code: string; name: string; country: string }) => {
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
      setSelectedNewProjectId(data.id);
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

  const addAllocationMutation = useMutation({
    mutationFn: async ({ projectId, allocationHours }: { projectId: string; allocationHours: number }) => {
      if (!company?.id) throw new Error('Missing company');

      // Use the canonical saver (handles insert/update + week normalization)
      const success = await saveResourceAllocation(
        projectId,
        person.id,
        'active',
        weekKey,
        allocationHours,
        company.id,
        startOfWorkWeek
      );

      if (!success) throw new Error('Failed to save allocation');
      return true;
    },
    onSuccess: (_data, variables) => {
      toast.success('Project allocation added');
      window.dispatchEvent(new CustomEvent('allocation-updated', {
        detail: { weekKey, resourceId: person.id, projectId: variables.projectId, hours: variables.allocationHours }
      }));
      // Fire-and-forget invalidations for instant feedback
      void queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      void queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      setShowAddProject(false);
      setSelectedNewProjectId('');
      setNewAllocationHours('');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add allocation');
      console.error('Add allocation error:', error);
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

  const handleAddAllocation = () => {
    if (!selectedNewProjectId) {
      toast.error('Please select a project');
      return;
    }

    const allocationHours = parseInputToHours(newAllocationHours, capacity, displayPreference);

    if (!Number.isFinite(allocationHours) || allocationHours <= 0) {
      toast.error(`Please enter a valid ${displayPreference === 'percentage' ? 'percentage' : 'hours'}`);
      return;
    }

    addAllocationMutation.mutate({ projectId: selectedNewProjectId, allocationHours });
  };


  const updateAllocationMutation = useMutation({
    mutationFn: async ({ projectId, newHours }: { projectId: string; newHours: number }) => {
      if (!company?.id) throw new Error('Missing company');

      const success = await saveResourceAllocation(
        projectId,
        person.id,
        'active',
        weekKey,
        newHours,
        company.id,
        startOfWorkWeek
      );

      if (!success) throw new Error('Failed to save allocation');
      return true;
    },
    onSuccess: (_data, variables) => {
      toast.success('Allocation updated');
      // Dispatch event so other components can update without full refetch
      window.dispatchEvent(new CustomEvent('allocation-updated', {
        detail: { weekKey, resourceId: person.id, projectId: variables.projectId, hours: variables.newHours }
      }));
      // Update local state immediately to reflect saved value
      setHours(prev => ({
        ...prev,
        [variables.projectId]: hoursToInputDisplay(variables.newHours, capacity, displayPreference)
      }));
      // Fire-and-forget invalidations for instant feedback
      void queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      void queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update allocation');
      console.error('Update error:', error);
    }
  });

  const deleteAllocationMutation = useMutation({
    mutationFn: async (projectId: string) => {
      if (!company?.id) throw new Error('Missing company');

      const success = await deleteResourceAllocation(
        projectId,
        person.id,
        'active',
        weekKey,
        company.id,
        startOfWorkWeek
      );

      if (!success) throw new Error('Failed to delete allocation');
      return true;
    },
    onSuccess: (_data, projectId) => {
      toast.success('Allocation deleted');
      window.dispatchEvent(new CustomEvent('allocation-updated', {
        detail: { weekKey, resourceId: person.id, projectId, hours: 0 }
      }));
      // Fire-and-forget invalidations for instant feedback
      void queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      void queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete allocation');
      console.error('Delete error:', error);
    }
  });

  const handleSave = (projectId: string) => {
    const raw = hours[projectId];

    const newHours = parseInputToHours(raw ?? '', capacity, displayPreference);

    if (!Number.isFinite(newHours) || newHours <= 0) {
      toast.error(`Please enter valid ${displayPreference === 'percentage' ? 'percentage' : 'hours'}`);
      return;
    }

    updateAllocationMutation.mutate({ projectId, newHours });
  };


  const handleDelete = (projectId: string, projectName: string) => {
    if (confirm(`Delete allocation for ${projectName}?`)) {
      deleteAllocationMutation.mutate(projectId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Allocations - {person.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Week: {format(weekStart, 'MMM dd, yyyy')}
          </div>

          {!showAddProject ? (
            <>
              {person.projects && person.projects.length > 0 ? (
                <div className="space-y-3">
                  {person.projects.map((project: any) => (
                    <div key={project.allocationId || project.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{getProjectDisplayName(project, projectDisplayPreference)}</p>
                        <p className="text-sm text-muted-foreground">Current: {formatAllocationValue(project.hours, capacity, displayPreference)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={inputConfig.min}
                          max={inputConfig.max}
                          step={inputConfig.step}
                          placeholder={hoursToInputDisplay(project.hours, capacity, displayPreference) || inputConfig.placeholder}
                          value={hours[project.id] ?? ''}
                          onChange={(e) => setHours({ ...hours, [project.id]: e.target.value })}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">
                          {displayPreference === 'percentage' ? '%' : 'hours'}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleSave(project.id)}
                          disabled={!(hours[project.id]?.trim()) || updateAllocationMutation.isPending}
                          className="bg-gradient-start hover:bg-gradient-mid text-white"
                        >
                          {updateAllocationMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(project.id, project.name)}
                          disabled={deleteAllocationMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No projects allocated
                </div>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => setShowAddProject(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Add Project Allocation</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddProject(false);
                    setShowCreateNew(false);
                  }}
                >
                  Back
                </Button>
              </div>

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
                          {selectedNewProjectId
                            ? availableProjects.find((project) => project.id === selectedNewProjectId)?.name || "Select a project"
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
                                    setSelectedNewProjectId(project.id);
                                    setComboboxOpen(false);
                                  }}
                                >
                                  {project.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      selectedNewProjectId === project.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCreateNew(true)}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="hours">
                      {displayPreference === 'percentage' ? 'Percentage' : 'Hours'}
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      value={newAllocationHours}
                      onChange={(e) => setNewAllocationHours(e.target.value)}
                      placeholder={displayPreference === 'percentage' ? 'Enter percentage (e.g. 50)' : 'Enter hours'}
                      step={displayPreference === 'percentage' ? '5' : '0.5'}
                      min="0"
                      max={displayPreference === 'percentage' ? '100' : undefined}
                    />
                  </div>

                  <Button
                    onClick={handleAddAllocation}
                    className="w-full bg-gradient-start hover:bg-gradient-mid text-white"
                    disabled={addAllocationMutation.isPending || !selectedNewProjectId || !newAllocationHours}
                  >
                    {addAllocationMutation.isPending ? 'Adding...' : 'Add Allocation'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
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
                      className="w-full bg-gradient-start hover:bg-gradient-mid text-white"
                      onClick={handleCreateProject}
                      disabled={createProjectMutation.isPending || !newProjectCode || !newProjectName || !newProjectCountry}
                    >
                      {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="hoursNew">Hours</Label>
                    <Input
                      id="hoursNew"
                      type="number"
                      value={newAllocationHours}
                      onChange={(e) => setNewAllocationHours(e.target.value)}
                      placeholder="Enter hours"
                      step="0.5"
                      min="0"
                    />
                  </div>

                  <Button
                    onClick={handleAddAllocation}
                    className="w-full bg-gradient-start hover:bg-gradient-mid text-white"
                    disabled={addAllocationMutation.isPending || !selectedNewProjectId || !newAllocationHours}
                  >
                    {addAllocationMutation.isPending ? 'Adding...' : 'Add Allocation'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
