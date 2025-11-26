import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Search, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ResourceAllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    type: 'active' | 'pre_registered';
  };
  weekStartDate: string;
  compact?: boolean;
}

export const ResourceAllocationDialog: React.FC<ResourceAllocationDialogProps> = ({
  open,
  onOpenChange,
  member,
  weekStartDate,
  compact = false,
}) => {
  const { company } = useCompany();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ') || 'Unknown';
  const initials = [member.firstName?.[0], member.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || 'U';

  // Fetch active projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, code, status')
        .eq('company_id', company?.id)
        .in('status', ['In Progress', 'Planning'])
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: open && !!company?.id,
  });

  // Fetch existing allocations
  const { data: existingAllocations } = useQuery({
    queryKey: ['allocations', member.id, weekStartDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('project_id, hours')
        .eq('resource_id', member.id)
        .eq('week_start_date', weekStartDate)
        .eq('resource_type', member.type);

      if (error) throw error;
      
      const allocationMap: Record<string, number> = {};
      data?.forEach(alloc => {
        allocationMap[alloc.project_id] = alloc.hours;
      });
      setAllocations(allocationMap);
      return allocationMap;
    },
    enabled: open,
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHoursChange = (projectId: string, hours: string) => {
    const value = hours === '' ? 0 : parseFloat(hours);
    if (!isNaN(value) && value >= 0) {
      setAllocations((prev) => ({ ...prev, [projectId]: value }));
    }
  };

  const handleSave = async () => {
    if (!company?.id) return;

    setSaving(true);
    try {
      // Get all project IDs that have allocations
      const projectsToUpdate = Object.keys(allocations).filter(
        (projectId) => allocations[projectId] > 0
      );

      // Delete existing allocations for this member and week
      await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('resource_id', member.id)
        .eq('week_start_date', weekStartDate)
        .eq('resource_type', member.type);

      // Insert new allocations
      if (projectsToUpdate.length > 0) {
        const allocationsToInsert = projectsToUpdate.map((projectId) => ({
          project_id: projectId,
          resource_id: member.id,
          resource_type: member.type,
          week_start_date: weekStartDate,
          hours: allocations[projectId],
          company_id: company.id,
        }));

        const { error } = await supabase
          .from('project_resource_allocations')
          .insert(allocationsToInsert);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Resource allocations updated successfully',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving allocations:', error);
      toast({
        title: 'Error',
        description: 'Failed to update allocations',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const totalHours = Object.values(allocations).reduce((sum, hours) => sum + hours, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={compact ? 'max-w-md' : 'max-w-2xl'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatarUrl || ''} alt={fullName} />
              <AvatarFallback className="text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span>{fullName}</span>
              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Week of {format(new Date(weekStartDate), 'MMM d, yyyy')}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Allocate hours to projects for this week
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Total hours indicator */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Hours
            </span>
            <span className="text-lg font-bold">{totalHours}h</span>
          </div>

          {/* Projects list */}
          <ScrollArea className={compact ? 'h-[300px]' : 'h-[400px]'}>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No projects found' : 'No active projects'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.code}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        value={allocations[project.id] || ''}
                        onChange={(e) => handleHoursChange(project.id, e.target.value)}
                        className="w-20 text-right"
                      />
                      <span className="text-xs text-muted-foreground">hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Allocations'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
