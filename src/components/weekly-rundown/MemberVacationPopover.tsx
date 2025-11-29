import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { CalendarIcon, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MemberVacationPopoverProps {
  memberId: string;
  memberName: string;
  weekStartDate: string;
  children: React.ReactNode;
}

export const MemberVacationPopover: React.FC<MemberVacationPopoverProps> = ({
  memberId,
  memberName,
  weekStartDate,
  children
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vacation' | 'project'>('vacation');
  
  // Vacation state
  const [vacationDate, setVacationDate] = useState<Date>();
  const [vacationEndDate, setVacationEndDate] = useState<Date>();
  const [vacationHours, setVacationHours] = useState('8');
  const [isSavingVacation, setIsSavingVacation] = useState(false);
  
  // Project state
  const [selectedProject, setSelectedProject] = useState('');
  const [projectDate, setProjectDate] = useState<Date>();
  const [projectEndDate, setProjectEndDate] = useState<Date>();
  const [projectHours, setProjectHours] = useState('');
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, code')
        .eq('company_id', company.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && open,
  });

  const handleSaveVacation = async () => {
    if (!vacationDate || !company?.id) return;

    setIsSavingVacation(true);
    try {
      const hours = parseFloat(vacationHours) || 8;
      const startDate = vacationDate;
      const endDate = vacationEndDate || vacationDate;
      
      // Generate all dates in range
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Delete existing leave records for these dates
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .in('date', dates);

      // Insert new leave records
      const leaveRecords = dates.map(date => ({
        member_id: memberId,
        company_id: company.id,
        date: date,
        hours: hours
      }));

      const { error } = await supabase
        .from('annual_leaves')
        .insert(leaveRecords);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['weekly-leave-details'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
      
      toast.success('Vacation hours saved');
      setVacationDate(undefined);
      setVacationEndDate(undefined);
      setVacationHours('8');
      setOpen(false);
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    } finally {
      setIsSavingVacation(false);
    }
  };

  const handleSaveProject = async () => {
    if (!selectedProject || !projectDate || !company?.id) return;

    setIsSavingProject(true);
    try {
      const hours = parseFloat(projectHours) || 0;
      if (hours <= 0) {
        toast.error('Please enter valid hours');
        return;
      }

      const startDate = projectDate;
      const endDate = projectEndDate || projectDate;
      
      // Generate all dates in range
      const dates = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Insert allocation records
      const allocationRecords = dates.map(date => ({
        project_id: selectedProject,
        resource_id: memberId,
        resource_type: 'active',
        allocation_date: date,
        hours: hours,
        company_id: company.id
      }));

      const { error } = await supabase
        .from('project_resource_allocations')
        .insert(allocationRecords);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
      
      toast.success('Project allocation saved');
      setSelectedProject('');
      setProjectDate(undefined);
      setProjectEndDate(undefined);
      setProjectHours('');
      setOpen(false);
    } catch (error) {
      console.error('Error saving project allocation:', error);
      toast.error('Failed to save project allocation');
    } finally {
      setIsSavingProject(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start" side="bottom">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <h4 className="font-medium text-sm">{memberName}</h4>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'vacation' | 'project')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vacation" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Vacation
              </TabsTrigger>
              <TabsTrigger value="project" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Project
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vacation" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !vacationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {vacationDate ? format(vacationDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={vacationDate}
                      onSelect={setVacationDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !vacationEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {vacationEndDate ? format(vacationEndDate, "PPP") : "Same as start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={vacationEndDate}
                      onSelect={setVacationEndDate}
                      disabled={(date) => vacationDate ? date < vacationDate : false}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Hours per Day</Label>
                <Input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={vacationHours}
                  onChange={(e) => setVacationHours(e.target.value)}
                  placeholder="8"
                />
              </div>

              <Button 
                onClick={handleSaveVacation}
                disabled={!vacationDate || isSavingVacation}
                className="w-full"
              >
                {isSavingVacation ? 'Saving...' : 'Save Vacation'}
              </Button>
            </TabsContent>
            
            <TabsContent value="project" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.code || project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !projectDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {projectDate ? format(projectDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectDate}
                      onSelect={setProjectDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !projectEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {projectEndDate ? format(projectEndDate, "PPP") : "Same as start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectEndDate}
                      onSelect={setProjectEndDate}
                      disabled={(date) => projectDate ? date < projectDate : false}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Hours per Day</Label>
                <Input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={projectHours}
                  onChange={(e) => setProjectHours(e.target.value)}
                  placeholder="0"
                />
              </div>

              <Button 
                onClick={handleSaveProject}
                disabled={!selectedProject || !projectDate || !projectHours || isSavingProject}
                className="w-full"
              >
                {isSavingProject ? 'Saving...' : 'Save Project'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};
