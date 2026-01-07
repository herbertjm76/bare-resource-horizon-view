import React, { useState } from 'react';
import { startOfWeek } from 'date-fns';
import { Plus, X, Search } from 'lucide-react';
import { toUTCDateKey } from '@/utils/dateKey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { toast } from 'sonner';

interface AddProjectRowProps {
  personId: string;
  resourceType: 'active' | 'pre_registered';
  existingProjectIds: string[];
  weeks: any[];
  onProjectAdded: () => void;
}

export const AddProjectRow: React.FC<AddProjectRowProps> = ({
  personId,
  resourceType,
  existingProjectIds,
  weeks,
  onProjectAdded
}) => {
  const { company } = useCompany();
  const { projectDisplayPreference, startOfWorkWeek } = useAppSettings();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Fetch available projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, code')
        .eq('company_id', company?.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && isAdding,
  });

  // Filter out projects already assigned to this person and apply search
  const availableProjects = projects
    .filter(p => !existingProjectIds.includes(p.id))
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const handleAddProject = async () => {
    if (!selectedProject || !company?.id) return;

    try {
      // Create an initial allocation with 0 hours for the first visible week.
      // Must align with how the grid groups weeks (company week start day).
      const weekStartsOn = startOfWorkWeek === 'Sunday' ? 0 : startOfWorkWeek === 'Saturday' ? 6 : 1;
      const firstWeekDate: Date | undefined = weeks[0]?.weekStartDate;
      
      if (!firstWeekDate) {
        toast.error('No visible weeks to add allocation');
        return;
      }
      
      // Use UTC-based date key to avoid timezone drift
      const weekStart = startOfWeek(firstWeekDate, { weekStartsOn });
      const allocationDateKey = toUTCDateKey(weekStart);
      
      console.log('[AddProjectRow] inserting allocation:', {
        personId,
        selectedProject,
        weekStartsOn,
        firstWeekDate: firstWeekDate.toISOString(),
        weekStart: weekStart.toISOString(),
        allocationDateKey,
      });

      const { data: insertedRow, error } = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: selectedProject,
          resource_id: personId,
          resource_type: resourceType,
          allocation_date: allocationDateKey,
          hours: 0,
          company_id: company.id,
        })
        .select('id, allocation_date')
        .single();

      if (error) throw error;
      
      console.log('[AddProjectRow] inserted row:', insertedRow);

      toast.success('Project added');
      onProjectAdded();
      setIsAdding(false);
      setSelectedProject('');
      setSearchTerm('');
      setPopoverOpen(false);
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast.error(error?.message ? `Failed to add project: ${error.message}` : 'Failed to add project');
    }
  };

  if (!isAdding) {
    return (
      <tr className="workload-resource-row">
        <td
          className="workload-resource-cell project-resource-column"
          colSpan={weeks.length + 1}
          style={{
            position: 'sticky',
            left: '0',
            zIndex: 10,
            padding: '8px 16px',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="workload-resource-row">
      <td
        className="workload-resource-cell project-resource-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 10,
          padding: '8px 16px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
        }}
      >
        <div className="flex items-center gap-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-8 flex-1 justify-between"
              >
                {selectedProjectData ? selectedProjectData.name : "Select project"}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8"
                  />
                </div>
              </div>
              <ScrollArea className="h-[250px]">
                <div className="p-1">
                  {availableProjects.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {searchTerm ? 'No projects found' : 'No available projects'}
                    </div>
                  ) : (
                    availableProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project.id);
                          setPopoverOpen(false);
                          setSearchTerm('');
                        }}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      >
                        {getProjectDisplayName(project, projectDisplayPreference)}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            onClick={handleAddProject}
            disabled={!selectedProject}
            className="h-8 px-3"
          >
            Add
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false);
              setSelectedProject('');
              setSearchTerm('');
              setPopoverOpen(false);
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
      {weeks.map((week) => {
        const weekKey = toUTCDateKey(week.weekStartDate);
        return (
          <td
            key={weekKey}
            className="workload-resource-cell week-column"
            style={{
              width: '80px',
              minWidth: '80px',
              maxWidth: '80px',
              borderRight: '1px solid rgba(156, 163, 175, 0.6)',
              borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
            }}
          />
        );
      })}
    </tr>
  );
};
