import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Search, Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';

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
  const { projectDisplayPreference, displayPreference, workWeekHours } = useAppSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
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
        .select('id, name, code, status, department')
        .eq('company_id', company?.id)
        .in('status', ['Active', 'In Progress', 'Planning'])
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
        .eq('allocation_date', weekStartDate)
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

  // Get unique departments from projects
  const departments = useMemo(() => {
    const depts = new Set<string>();
    projects.forEach(p => {
      if (p.department) depts.add(p.department);
    });
    return Array.from(depts).sort();
  }, [projects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || p.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleHoursChange = (projectId: string, hours: string) => {
    const value = hours === '' ? 0 : parseFloat(hours);
    if (!isNaN(value) && value >= 0) {
      setAllocations((prev) => ({ ...prev, [projectId]: value }));
    }
  };

  const handleDeleteAllocation = async (projectId: string) => {
    if (!company?.id) return;

    try {
      // Delete from database immediately
      const { error } = await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('resource_id', member.id)
        .eq('project_id', projectId)
        .eq('allocation_date', weekStartDate)
        .eq('resource_type', member.type);

      if (error) throw error;

      // Update local state
      setAllocations((prev) => {
        const updated = { ...prev };
        delete updated[projectId];
        return updated;
      });

      toast({
        title: 'Deleted',
        description: 'Allocation removed successfully',
      });
    } catch (error) {
      console.error('Error deleting allocation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete allocation',
        variant: 'destructive',
      });
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
        .eq('allocation_date', weekStartDate)
        .eq('resource_type', member.type);

      // Insert new allocations
      if (projectsToUpdate.length > 0) {
        const allocationsToInsert = projectsToUpdate.map((projectId) => ({
          project_id: projectId,
          resource_id: member.id,
          resource_type: member.type,
          allocation_date: weekStartDate,
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
      <DialogContent className={compact ? 'max-w-md' : 'max-w-lg'}>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatarUrl || ''} alt={fullName} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-semibold">{fullName}</span>
              <span className="text-[11px] text-muted-foreground font-normal flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(weekStartDate), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-md">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">{formatAllocationValue(totalHours, workWeekHours, displayPreference)}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search and Department Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-sm"
              />
            </div>
            {departments.length > 0 && (
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder="Department" />
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
            )}
          </div>

          {/* Projects grid */}
          <ScrollArea className={compact ? 'h-[280px]' : 'h-[360px]'}>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-xs text-muted-foreground">Loading...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-xs text-muted-foreground">
                  {searchTerm ? 'No projects found' : 'No active projects'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 pr-3">
                {filteredProjects.map((project) => {
                  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
                  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);
                  
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-1.5 p-2 border border-border/60 rounded-lg hover:bg-accent/50 hover:border-border transition-all max-w-full overflow-hidden group"
                    >
                      <div className="flex-[3] min-w-0 overflow-hidden">
                        <span
                          className="block w-full font-semibold text-[11px] leading-tight truncate text-foreground"
                          title={primaryDisplay}
                        >
                          {primaryDisplay && primaryDisplay.length > 15
                            ? `${primaryDisplay.slice(0, 15)}…`
                            : primaryDisplay}
                        </span>
                        {secondaryDisplay && (
                          <span className="block text-[10px] text-muted-foreground truncate">
                            {secondaryDisplay}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex-shrink-0 min-w-[44px]">
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="0"
                          value={allocations[project.id] || ''}
                          onChange={(e) => handleHoursChange(project.id, e.target.value)}
                          className="w-full h-7 text-xs text-center font-semibold px-1"
                        />
                      </div>
                      {allocations[project.id] > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAllocation(project.id)}
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
