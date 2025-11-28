import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const { company } = useCompany();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      setOpen(false);
      setSelectedProjectId('');
      setHours('');
      onAdd();
    },
    onError: (error) => {
      toast.error('Failed to add allocation');
      console.error('Add error:', error);
    }
  });

  const handleAdd = () => {
    const allocationHours = parseFloat(hours);
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }
    if (isNaN(allocationHours) || allocationHours <= 0) {
      toast.error('Please enter valid hours');
      return;
    }
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
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No available projects
                    </div>
                  ) : (
                    availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.code} - {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Enter hours"
                step="0.5"
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addMutation.isPending || !selectedProjectId || !hours}
            >
              {addMutation.isPending ? 'Adding...' : 'Add Allocation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
