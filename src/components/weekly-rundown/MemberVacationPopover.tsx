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
import { getTotalAllocationWarningStatus } from '@/hooks/allocations/utils/utilizationUtils';
import { useLeaveTypes } from '@/hooks/leave/useLeaveTypes';
import { useAuthorization } from '@/hooks/useAuthorization';

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
  const { displayPreference, workWeekHours, allocationWarningThreshold, allocationDangerThreshold, allocationMaxLimit } = useAppSettings();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vacation' | 'project'>('project');
  
  // Check if user is admin or owner
  const { userRole } = useAuthorization();
  const canEdit = userRole === 'admin' || userRole === 'owner';
  
  // Leave types from company settings
  const { leaveTypes } = useLeaveTypes();

  // Get default value based on display preference
  const getDefaultHours = () => displayPreference === 'percentage' ? '20' : '8'; // 20% of 40h = 8h
  
  // Vacation state
  const [vacationDate, setVacationDate] = useState<Date>();
  const [vacationEndDate, setVacationEndDate] = useState<Date>();
  const [startDayPortion, setStartDayPortion] = useState<'full' | 'am' | 'pm'>('full');
  const [endDayPortion, setEndDayPortion] = useState<'full' | 'am' | 'pm'>('full');
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string>('');
  const [isSavingVacation, setIsSavingVacation] = useState(false);
  
  // Calculate daily hours (working hours per day)
  const dailyHours = workWeekHours / 5;
  
  // Project state
  const [selectedProject, setSelectedProject] = useState('');
  const [projectComboboxOpen, setProjectComboboxOpen] = useState(false);
  const [projectWeeks, setProjectWeeks] = useState<Record<string, string>>({});
  const [isSavingProject, setIsSavingProject] = useState(false);
  
  // Auto-select first leave type (usually Annual Leave)
  React.useEffect(() => {
    if (leaveTypes.length > 0 && !selectedLeaveTypeId) {
      setSelectedLeaveTypeId(leaveTypes[0].id);
    }
  }, [leaveTypes, selectedLeaveTypeId]);

  // Generate next 4 weeks starting from current week
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    
    for (let i = 0; i < 4; i++) {
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

  // Helper to check if a date is a working day (Mon-Fri)
  const isWorkingDay = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  // Calculate hours for a given day portion
  const getHoursForPortion = (portion: 'full' | 'am' | 'pm'): number => {
    return portion === 'full' ? dailyHours : dailyHours / 2;
  };

  const handleSaveVacation = async () => {
    if (!vacationDate || !company?.id) return;

    setIsSavingVacation(true);
    try {
      const startDate = vacationDate;
      const endDate = vacationEndDate || vacationDate;
      
      // Generate leave records for working days only
      const leaveRecords: { member_id: string; company_id: string; date: string; hours: number; leave_type_id?: string }[] = [];
      const currentDate = new Date(startDate);
      const allDates: string[] = [];
      
      while (currentDate <= endDate) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        allDates.push(dateString);
        
        // Only include working days
        if (isWorkingDay(currentDate)) {
          let hours: number;
          
          // Determine hours based on position in range
          const isStartDate = currentDate.getTime() === startDate.getTime();
          const isEndDate = currentDate.getTime() === endDate.getTime();
          
          if (isStartDate && isEndDate) {
            // Single day - use start portion
            hours = getHoursForPortion(startDayPortion);
          } else if (isStartDate) {
            // First day of range
            hours = getHoursForPortion(startDayPortion);
          } else if (isEndDate) {
            // Last day of range
            hours = getHoursForPortion(endDayPortion);
          } else {
            // Middle days - full day
            hours = dailyHours;
          }
          
          leaveRecords.push({
            member_id: memberId,
            company_id: company.id,
            date: dateString,
            hours,
            leave_type_id: selectedLeaveTypeId || undefined
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (leaveRecords.length === 0) {
        toast.error('No working days in selected date range');
        setIsSavingVacation(false);
        return;
      }

      // Delete existing leave records for these dates
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .in('date', allDates);

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
      
      const totalHours = leaveRecords.reduce((sum, r) => sum + r.hours, 0);
      toast.success(`Vacation saved: ${totalHours}h across ${leaveRecords.length} working day(s)`);
      setVacationDate(undefined);
      setVacationEndDate(undefined);
      setStartDayPortion('full');
      setEndDayPortion('full');
      // Keep selectedLeaveTypeId for convenience on next use
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
    const maxHours = (workWeekHours * allocationMaxLimit) / 100;
    for (const [weekKey, value] of Object.entries(projectWeeks)) {
      if (value && parseFloat(value) > 0) {
        const inputValue = parseFloat(value);
        if (displayPreference === 'percentage' && inputValue > allocationMaxLimit) {
          toast.error(`Allocation cannot exceed ${allocationMaxLimit}%`);
          return;
        }
        if (displayPreference === 'hours' && inputValue > maxHours) {
          toast.error(`Allocation cannot exceed ${maxHours}h (${allocationMaxLimit}% of capacity)`);
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

  // Calculate warning status for each week input (simplified - just checks single project allocation)
  // Full total allocation check happens in the parent components where context is available
  const getWeekWarningStatus = (weekValue: string) => {
    const inputValue = parseFloat(weekValue) || 0;
    const currentHours = displayPreference === 'percentage' 
      ? (inputValue / 100) * workWeekHours 
      : inputValue;
    // For new allocations, we don't have other project context, so check this allocation only
    return getTotalAllocationWarningStatus(
      currentHours, 
      0, // other projects hours - not available in this context
      0, // leave hours - not available in this context
      workWeekHours, 
      displayPreference, 
      allocationWarningThreshold, 
      allocationDangerThreshold, 
      allocationMaxLimit
    );
  };
  
  // Calculate preview of vacation hours
  const vacationPreview = useMemo(() => {
    if (!vacationDate) return null;
    
    const startDate = vacationDate;
    const endDate = vacationEndDate || vacationDate;
    let totalHours = 0;
    let workingDays = 0;
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isWorkingDay(currentDate)) {
        const isStart = currentDate.getTime() === startDate.getTime();
        const isEnd = currentDate.getTime() === endDate.getTime();
        
        if (isStart && isEnd) {
          totalHours += getHoursForPortion(startDayPortion);
        } else if (isStart) {
          totalHours += getHoursForPortion(startDayPortion);
        } else if (isEnd) {
          totalHours += getHoursForPortion(endDayPortion);
        } else {
          totalHours += dailyHours;
        }
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { totalHours, workingDays };
  }, [vacationDate, vacationEndDate, startDayPortion, endDayPortion, dailyHours]);

  // If user doesn't have edit permission, just render children without popover
  if (!canEdit) {
    return <>{children}</>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] max-h-[85vh] overflow-auto border-border-primary shadow-elevation-2"
        align="start"
        side="bottom"
        sideOffset={10}
        collisionPadding={16}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-border-primary">
            <h4 className="font-semibold text-base text-text-primary">{memberName}</h4>
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'vacation' | 'project')}>
            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted">
              <TabsTrigger
                value="project"
                className="flex items-center justify-center gap-2 h-9 text-sm data-[state=active]:bg-gradient-start data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Project
              </TabsTrigger>
              <TabsTrigger
                value="vacation"
                className="flex items-center justify-center gap-2 h-9 text-sm data-[state=active]:bg-gradient-start data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
              >
                <CalendarIcon className="h-4 w-4" />
                Vacation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vacation" className="mt-4 space-y-4">
              {/* Leave Type Selection - Compact */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Leave Type</Label>
                <Select value={selectedLeaveTypeId} onValueChange={setSelectedLeaveTypeId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type">
                      {selectedLeaveTypeId && leaveTypes.find(t => t.id === selectedLeaveTypeId) && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: leaveTypes.find(t => t.id === selectedLeaveTypeId)?.color || '#3B82F6' }}
                          />
                          <span>{leaveTypes.find(t => t.id === selectedLeaveTypeId)?.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: type.color || '#3B82F6' }}
                          />
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Start Date</Label>
                <div className="flex gap-3 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal h-10",
                          !vacationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {vacationDate ? format(vacationDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto z-[100]" align="start" side="bottom">
                      <Calendar
                        mode="single"
                        selected={vacationDate}
                        onSelect={setVacationDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex rounded-md border border-input overflow-hidden h-10 shrink-0">
                    {(['full', 'am', 'pm'] as const).map((portion) => (
                      <button
                        key={portion}
                        type="button"
                        onClick={() => setStartDayPortion(portion)}
                        className={cn(
                          "h-full px-3 text-sm font-medium transition-colors whitespace-nowrap",
                          startDayPortion === portion
                            ? "bg-gradient-start text-white"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {portion === 'full' ? 'Full' : portion.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">End Date (optional)</Label>
                <div className="flex gap-3 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal h-10",
                          !vacationEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {vacationEndDate ? format(vacationEndDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto z-[100]" align="start" side="bottom">
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
                  <div
                    className={cn(
                      "flex rounded-md border border-input overflow-hidden h-10 shrink-0",
                      !vacationEndDate && "opacity-50"
                    )}
                  >
                    {(['full', 'am', 'pm'] as const).map((portion) => (
                      <button
                        key={portion}
                        type="button"
                        onClick={() => vacationEndDate && setEndDayPortion(portion)}
                        disabled={!vacationEndDate}
                        className={cn(
                          "h-full px-3 text-sm font-medium transition-colors whitespace-nowrap",
                          endDayPortion === portion
                            ? "bg-gradient-start text-white"
                            : "bg-background text-muted-foreground hover:bg-muted",
                          !vacationEndDate && "cursor-not-allowed"
                        )}
                      >
                        {portion === 'full' ? 'Full' : portion.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Summary */}
              {vacationPreview && (
                <div className="bg-muted/50 rounded-md p-3 text-sm">
                  <span className="text-muted-foreground">Total: </span>
                  <span className="font-medium text-foreground">{vacationPreview.totalHours}h</span>
                  <span className="text-muted-foreground"> across </span>
                  <span className="font-medium text-foreground">{vacationPreview.workingDays} working day{vacationPreview.workingDays !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Save Button */}
              <Button
                onClick={handleSaveVacation}
                disabled={!vacationDate || isSavingVacation}
                className="w-full h-10 bg-gradient-start hover:bg-gradient-mid text-white"
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
                className="w-full h-10 bg-gradient-start hover:bg-gradient-mid text-white"
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