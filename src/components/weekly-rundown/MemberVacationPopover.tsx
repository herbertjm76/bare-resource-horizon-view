import React, { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { CalendarIcon, Briefcase, Check, ChevronsUpDown, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getAllocationWarningStatus } from '@/hooks/allocations/utils/utilizationUtils';

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
  const { displayPreference, workWeekHours, allocationWarningThreshold, allocationDangerThreshold } = useAppSettings();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vacation' | 'project'>('vacation');
  
  // Get default value based on display preference
  const getDefaultHours = () => displayPreference === 'percentage' ? '20' : '8'; // 20% of 40h = 8h
  
  // Vacation state
  const [vacationDate, setVacationDate] = useState<Date>();
  const [vacationEndDate, setVacationEndDate] = useState<Date>();
  const [vacationValue, setVacationValue] = useState(getDefaultHours());
  const [isSavingVacation, setIsSavingVacation] = useState(false);
  
  // Project state
  const [selectedProject, setSelectedProject] = useState('');
  const [projectComboboxOpen, setProjectComboboxOpen] = useState(false);
  const [projectWeeks, setProjectWeeks] = useState<Record<string, string>>({});
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Generate next 8 weeks starting from current week
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(monday);
      weekStart.setDate(monday.getDate() + (i * 7));
      weeks.push(format(weekStart, 'yyyy-MM-dd'));
    }
    return weeks;
  };

  const weeks = generateWeeks();

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

    const inputValue = parseFloat(vacationValue) || 8;
    
    // Validate max 200% for vacation (though typically 100% max for leave per day)
    if (displayPreference === 'percentage' && inputValue > 200) {
      toast.error('Allocation cannot exceed 200%');
      return;
    }
    const maxHours = workWeekHours * 2;
    if (displayPreference === 'hours' && inputValue > maxHours) {
      toast.error(`Allocation cannot exceed ${maxHours}h (200% of capacity)`);
      return;
    }

    setIsSavingVacation(true);
    try {
      // Convert display value to hours if percentage mode
      const hours = displayPreference === 'percentage' 
        ? (inputValue / 100) * workWeekHours 
        : inputValue;
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
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      
      toast.success('Vacation hours saved');
      setVacationDate(undefined);
      setVacationEndDate(undefined);
      setVacationValue(getDefaultHours());
      setOpen(false);
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    } finally {
      setIsSavingVacation(false);
    }
  };

  const handleSaveProject = async () => {
    if (!selectedProject || !company?.id) return;

    // Validate all week entries before saving
    const maxHours = workWeekHours * 2;
    for (const [weekKey, value] of Object.entries(projectWeeks)) {
      if (value && parseFloat(value) > 0) {
        const inputValue = parseFloat(value);
        if (displayPreference === 'percentage' && inputValue > 200) {
          toast.error('Allocation cannot exceed 200%');
          return;
        }
        if (displayPreference === 'hours' && inputValue > maxHours) {
          toast.error(`Allocation cannot exceed ${maxHours}h (200% of capacity)`);
          return;
        }
      }
    }

    setIsSavingProject(true);
    try {
      // Get all weeks with values entered and convert to hours
      const weekEntries = Object.entries(projectWeeks)
        .filter(([_, value]) => value && parseFloat(value) > 0)
        .map(([weekKey, value]) => {
          const inputValue = parseFloat(value);
          // Convert display value to hours if percentage mode
          const hours = displayPreference === 'percentage' 
            ? (inputValue / 100) * workWeekHours 
            : inputValue;
          
          return {
            project_id: selectedProject,
            resource_id: memberId,
            resource_type: 'active' as const,
            allocation_date: weekKey,
            hours,
            company_id: company.id
          };
        });

      if (weekEntries.length === 0) {
        toast.error(`Please enter ${displayPreference === 'percentage' ? 'percentage' : 'hours'} for at least one week`);
        return;
      }

      const { error } = await supabase
        .from('project_resource_allocations')
        .insert(weekEntries);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      
      toast.success('Project allocation saved');
      setSelectedProject('');
      setProjectWeeks({});
      setOpen(false);
    } catch (error) {
      console.error('Error saving project allocation:', error);
      toast.error('Failed to save project allocation');
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleWeekHoursChange = (weekKey: string, value: string) => {
    setProjectWeeks(prev => ({
      ...prev,
      [weekKey]: value
    }));
  };

  // Calculate warning status for vacation input
  const vacationWarningStatus = useMemo(() => {
    const inputValue = parseFloat(vacationValue) || 0;
    const percentage = displayPreference === 'percentage' 
      ? inputValue 
      : (workWeekHours > 0 ? (inputValue / workWeekHours) * 100 : 0);
    return getAllocationWarningStatus(percentage, allocationWarningThreshold, allocationDangerThreshold);
  }, [vacationValue, displayPreference, workWeekHours, allocationWarningThreshold, allocationDangerThreshold]);

  // Calculate warning status for each week input
  const getWeekWarningStatus = (weekValue: string) => {
    const inputValue = parseFloat(weekValue) || 0;
    const percentage = displayPreference === 'percentage' 
      ? inputValue 
      : (workWeekHours > 0 ? (inputValue / workWeekHours) * 100 : 0);
    return getAllocationWarningStatus(percentage, allocationWarningThreshold, allocationDangerThreshold);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96 border-border-primary shadow-elevation-2" align="start" side="top" sideOffset={12}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border-primary">
            <h4 className="font-semibold text-base text-text-primary">{memberName}</h4>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'vacation' | 'project')}>
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-bg-tertiary">
              <TabsTrigger value="vacation" className="flex items-center justify-center gap-2 h-9 text-sm data-[state=active]:bg-theme-primary data-[state=active]:text-white data-[state=active]:shadow-sm">
                <CalendarIcon className="h-4 w-4" />
                Vacation
              </TabsTrigger>
              <TabsTrigger value="project" className="flex items-center justify-center gap-2 h-9 text-sm data-[state=active]:bg-theme-primary data-[state=active]:text-white data-[state=active]:shadow-sm">
                <Briefcase className="h-4 w-4" />
                Project
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vacation" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-primary">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 border-border-primary hover:bg-bg-secondary",
                        !vacationDate && "text-text-tertiary"
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
                <Label className="text-sm font-medium text-text-primary">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 border-border-primary hover:bg-bg-secondary",
                        !vacationEndDate && "text-text-tertiary"
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
                <Label className="text-sm font-medium text-text-primary">
                  {displayPreference === 'percentage' ? 'Percentage per Day' : 'Hours per Day'}
                </Label>
                <div className="flex items-center gap-2">
                  {vacationWarningStatus.level !== 'normal' && (
                    <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${vacationWarningStatus.level === 'warning' ? 'text-amber-500' : 'text-destructive'}`} />
                  )}
                  <TooltipProvider>
                    <Tooltip open={vacationWarningStatus.level !== 'normal'}>
                      <TooltipTrigger asChild>
                        <Input
                          type="number"
                          min="0"
                          max={displayPreference === 'percentage' ? '100' : '24'}
                          step={displayPreference === 'percentage' ? '5' : '0.5'}
                          value={vacationValue}
                          onChange={(e) => setVacationValue(e.target.value)}
                          placeholder={displayPreference === 'percentage' ? '20' : '8'}
                          className={`h-10 flex-1 ${vacationWarningStatus.borderClass} ${vacationWarningStatus.bgClass} ${vacationWarningStatus.textClass}`}
                        />
                      </TooltipTrigger>
                      {vacationWarningStatus.message && (
                        <TooltipContent side="top" className={vacationWarningStatus.level === 'warning' ? 'bg-amber-500 text-white' : 'bg-destructive text-destructive-foreground'}>
                          <p>{vacationWarningStatus.message}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <Button 
                onClick={handleSaveVacation}
                disabled={!vacationDate || isSavingVacation}
                className="w-full h-10 bg-theme-primary hover:bg-theme-primary/90 text-white font-medium"
              >
                {isSavingVacation ? 'Saving...' : 'Save Vacation'}
              </Button>
            </TabsContent>
            
            <TabsContent value="project" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-primary">Project</Label>
                <Popover open={projectComboboxOpen} onOpenChange={setProjectComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={projectComboboxOpen}
                      className="w-full justify-between h-10 border-border-primary"
                    >
                      {selectedProject
                        ? projects.find((project) => project.id === selectedProject)?.name || "Select project"
                        : "Select project"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-background" align="start">
                    <Command className="bg-background">
                      <CommandInput placeholder="Search projects..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                          {projects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={`${project.name} ${project.code}`}
                              onSelect={() => {
                                setSelectedProject(project.id);
                                setProjectComboboxOpen(false);
                              }}
                            >
                              {project.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedProject === project.id ? "opacity-100" : "opacity-0"
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-text-primary">
                  {displayPreference === 'percentage' ? 'Percentage per Week' : 'Hours per Week'}
                </Label>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                  {weeks.map((weekKey) => {
                    const weekDate = new Date(weekKey);
                    const weekEnd = new Date(weekDate);
                    weekEnd.setDate(weekDate.getDate() + 6);
                    
                    return (
                      <div key={weekKey} className="flex items-center gap-2">
                        <Label className="text-xs text-text-secondary w-32 flex-shrink-0">
                          {format(weekDate, 'MMM d')} - {format(weekEnd, 'MMM d')}
                        </Label>
                        {getWeekWarningStatus(projectWeeks[weekKey] || '').level !== 'normal' && (
                          <AlertTriangle className={`h-3 w-3 flex-shrink-0 ${getWeekWarningStatus(projectWeeks[weekKey] || '').level === 'warning' ? 'text-amber-500' : 'text-destructive'}`} />
                        )}
                        <TooltipProvider>
                          <Tooltip open={getWeekWarningStatus(projectWeeks[weekKey] || '').level !== 'normal'}>
                            <TooltipTrigger asChild>
                              <Input
                                type="number"
                                min="0"
                                max={displayPreference === 'percentage' ? '200' : '168'}
                                step={displayPreference === 'percentage' ? '5' : '0.5'}
                                value={projectWeeks[weekKey] || ''}
                                onChange={(e) => handleWeekHoursChange(weekKey, e.target.value)}
                                placeholder="0"
                                className={`flex-1 h-9 ${getWeekWarningStatus(projectWeeks[weekKey] || '').borderClass} ${getWeekWarningStatus(projectWeeks[weekKey] || '').bgClass} ${getWeekWarningStatus(projectWeeks[weekKey] || '').textClass}`}
                              />
                            </TooltipTrigger>
                            {getWeekWarningStatus(projectWeeks[weekKey] || '').message && (
                              <TooltipContent side="top" className={getWeekWarningStatus(projectWeeks[weekKey] || '').level === 'warning' ? 'bg-amber-500 text-white' : 'bg-destructive text-destructive-foreground'}>
                                <p>{getWeekWarningStatus(projectWeeks[weekKey] || '').message}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={handleSaveProject}
                disabled={!selectedProject || isSavingProject}
                className="w-full h-10 bg-theme-primary hover:bg-theme-primary/90 text-white font-medium"
              >
                {isSavingProject ? 'Saving...' : 'Save Project Allocation'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};