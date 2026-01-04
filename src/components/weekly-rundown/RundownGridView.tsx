import React, { useState } from 'react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Calendar, Building, Pencil, Circle, Palmtree } from 'lucide-react';
import { RundownMode } from './WeeklyRundownView';
import { AvatarWithHourDial } from './AvatarWithHourDial';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';
import { EditPersonAllocationsDialog } from './EditPersonAllocationsDialog';
import { EditProjectAllocationsDialog } from './EditProjectAllocationsDialog';
import { MemberVacationPopover } from './MemberVacationPopover';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';
import { AddProjectAllocation } from './AddProjectAllocation';
import { OtherLeaveSection } from './OtherLeaveSection';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { formatAllocationValue, formatDualAllocationValue } from '@/utils/allocationDisplay';
import * as LucideIcons from 'lucide-react';

interface RundownGridViewProps {
  items: any[];
  rundownMode: RundownMode;
  isFullscreen: boolean;
  selectedWeek: Date;
}

export const RundownGridView: React.FC<RundownGridViewProps> = React.memo(({
  items,
  rundownMode,
  isFullscreen,
  selectedWeek
}) => {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-card rounded-lg border">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No {rundownMode} found for this week</p>
          <p className="text-sm text-muted-foreground mt-2">Try selecting a different week or check your filters</p>
        </div>
      </div>
    );
  }

  const gridCols = isFullscreen ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <TooltipProvider>
      <div className={`grid ${gridCols} gap-4`}>
        {items.map((item) => (
          <div key={item.id}>
            {rundownMode === 'people' ? (
              <PersonGridCard person={item} selectedWeek={selectedWeek} />
            ) : (
              <ProjectGridCard project={item} selectedWeek={selectedWeek} />
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
});

const PersonGridCard: React.FC<{ person: any; selectedWeek: Date }> = React.memo(({ person, selectedWeek }) => {
  const { startOfWorkWeek, displayPreference, workWeekHours, projectDisplayPreference } = useAppSettings();
  const capacity = person.capacity || workWeekHours;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Calculate week start date string for MemberVacationPopover
  const weekStartDate = format(getWeekStartDate(selectedWeek, startOfWorkWeek), 'yyyy-MM-dd');
  const personName = `${person.first_name || ''} ${person.last_name || ''}`.trim() || person.name || 'Unknown';
  
  // Calculate total leave hours
  const totalLeaveHours = person.leave 
    ? (person.leave.annualLeave || 0) + (person.leave.vacationLeave || 0) + (person.leave.medicalLeave || 0) + (person.leave.publicHoliday || 0)
    : 0;
  
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <>
      <div className="glass-card rounded-xl border p-4 hover:shadow-lg transition-all duration-300 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <MemberVacationPopover
          memberId={person.id}
          memberName={personName}
          weekStartDate={weekStartDate}
        >
          <div className="cursor-pointer">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage src={person.avatar} alt={personName} />
                  <AvatarFallback className="text-xs bg-gradient-modern text-white">
                    {personName?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">{personName}</p>
                <p className="text-xs text-muted-foreground">Click to add hours or leave</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </MemberVacationPopover>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{personName}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span className="truncate">{person.department || 'No Department'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StandardizedBadge 
            variant={
              person.utilization >= 100 ? "metric" : 
              person.utilization >= 70 ? "warning" : 
              "error"
            }
            size="sm"
          >
            {Math.round(person.utilization || 0)}%
          </StandardizedBadge>
          {/* Leave indicator */}
          {totalLeaveHours > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Palmtree className="h-3 w-3" />
                  <span>{formatAllocationValue(totalLeaveHours, capacity, displayPreference)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Leave: {formatDualAllocationValue(totalLeaveHours, capacity, displayPreference)}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Stacked Bar Graph */}
      <div className="mb-3">
        <div className="w-full h-6 bg-muted/30 rounded-lg overflow-hidden flex relative">
          {/* Project segments */}
          {person.projects && person.projects.length > 0 && (
            (() => {
              let cumulative = 0;
              return person.projects.map((project: any, idx: number) => {
                const percentage = (project.hours / capacity) * 100;
                const startPercent = cumulative;
                cumulative += percentage;
                const isOverflow = startPercent >= 100;
                
                return (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <div
                        className="h-full transition-all hover:opacity-80 cursor-pointer"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: isOverflow ? '#ef4444' : generateMonochromaticShades(idx, person.projects.length),
                        }}
                      />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <p className="font-medium">{getProjectDisplayName(project, projectDisplayPreference)}</p>
                        <p>{formatDualAllocationValue(project.hours, capacity, displayPreference)}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                });
            })()
          )}
          {/* Leave segment */}
          {totalLeaveHours > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="h-full transition-all hover:opacity-80 cursor-pointer flex items-center justify-center"
                  style={{
                    width: `${(totalLeaveHours / capacity) * 100}%`,
                    backgroundColor: 'hsl(var(--primary) / 0.15)',
                  }}
                >
                  <Palmtree className="h-3 w-3 text-primary/70" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <p className="font-medium">Leave</p>
                <p>{formatDualAllocationValue(totalLeaveHours, capacity, displayPreference)}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {/* Empty state */}
          {(!person.projects || person.projects.length === 0) && totalLeaveHours === 0 && (
            <div className="w-full h-full bg-muted/50 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No projects</span>
            </div>
          )}
        </div>
      </div>

      {/* Project List */}
      {person.projects && person.projects.length > 0 && (
        <div className="space-y-1.5">
          {person.projects.slice(0, 5).map((project: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: generateMonochromaticShades(idx, person.projects.length) }}
                />
                <span className="truncate group-hover:text-primary transition-colors">
                  {getProjectDisplayName(project, projectDisplayPreference)}
                </span>
              </div>
              <StandardizedBadge variant="metric" size="sm" className="ml-2">{formatDualAllocationValue(project.hours, capacity, displayPreference)}</StandardizedBadge>
            </div>
          ))}
          {person.projects.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{person.projects.length - 5} more
            </p>
          )}
        </div>
      )}

      {/* Footer Row - Stats on left, Action buttons on right */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{person.projects?.length || 0} projects</span>
        </div>
        <div className="flex items-center gap-1">
          <AddProjectAllocation
            memberId={person.id}
            weekStartDate={weekStartDate}
            existingProjectIds={person.projects?.map((p: any) => p.id) || []}
            onAdd={handleDataChange}
            variant="compact"
          />
          <OtherLeaveSection
            memberId={person.id}
            weekStartDate={weekStartDate}
            onUpdate={handleDataChange}
            variant="compact"
          />
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => setEditDialogOpen(true)}
            className="h-7 w-7"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>

    <EditPersonAllocationsDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      person={person}
      selectedWeek={selectedWeek}
    />
    </>
  );
});

const ProjectGridCard: React.FC<{ project: any; selectedWeek: Date }> = React.memo(({ project, selectedWeek }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { departments } = useOfficeSettings();
  const { projectDisplayPreference, startOfWorkWeek, displayPreference, workWeekHours } = useAppSettings();
  
  // Calculate week start date string for MemberVacationPopover
  const weekStartDate = format(getWeekStartDate(selectedWeek, startOfWorkWeek), 'yyyy-MM-dd');
  
  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);
  
  const perFteCapacity = workWeekHours;
  const teamCapacity = perFteCapacity * Math.max(project.teamMembers?.length || 1, 1);
  const totalHours = project.totalHours || 0;
  const totalFte = perFteCapacity > 0 ? totalHours / perFteCapacity : 0;

  const getCapacityColor = (percentage: number) => {
    if (percentage > 100) return 'hsl(var(--destructive))';
    if (percentage >= 90) return 'hsl(39, 100%, 50%)';
    if (percentage >= 75) return 'hsl(120, 100%, 40%)';
    return 'hsl(var(--muted-foreground))';
  };

  const averageCapacity = project.teamMembers?.length > 0 
    ? project.teamMembers.reduce((sum: number, member: any) => sum + (member.capacityPercentage || 0), 0) / project.teamMembers.length 
    : 0;

  // Get the icon component for the department from office settings
  const getIconComponent = () => {
    if (!project.department) return Circle;
    
    // Find the department in office settings
    const departmentData = departments.find(d => d.name === project.department);
    if (!departmentData?.icon) return Circle;
    
    // Convert icon name to PascalCase (e.g., 'circle' -> 'Circle')
    const iconName = departmentData.icon
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Circle;
  };

  const ProjectIcon = getIconComponent();

  return (
    <>
      <div className="glass-card glass-hover rounded-2xl border-0 p-4 cursor-pointer overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="flex items-start gap-2.5 mb-3 relative z-10">
          {/* Small Line Art Icon */}
          <ProjectIcon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
          
          <div className="flex-1 min-w-0">
            {/* Project Primary Display */}
            <h3 className="font-bold text-lg truncate mb-0.5">{primaryDisplay}</h3>
            {/* Project Secondary Display */}
            {secondaryDisplay && (
              <p className="text-xs text-muted-foreground font-medium truncate mb-0.5">{secondaryDisplay}</p>
            )}
            {/* Department - Tertiary */}
            {project.department && (
              <p className="text-[10px] text-muted-foreground truncate">{project.department}</p>
            )}
          </div>
          <StandardizedBadge variant="metric" size="sm" className="flex-shrink-0">
            {totalFte.toFixed(1)} FTE
          </StandardizedBadge>
        </div>

        <div className="space-y-3 relative z-10">

          {/* Team Member Avatars */}
          <div>
            <div className="flex flex-wrap gap-3 justify-center items-end">
              {project.teamMembers && project.teamMembers.slice(0, 8).map((member: any) => (
                <MemberVacationPopover
                  key={member.id}
                  memberId={member.id}
                  memberName={member.name}
                  weekStartDate={weekStartDate}
                >
                  <div className="cursor-pointer">
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1.5">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-md hover:ring-primary/40 transition-all">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs bg-gradient-modern text-white">
                              {member.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-center gap-0.5">
                            <p className="text-[10px] font-semibold text-foreground">{member.name?.split(' ')[0]}</p>
                            <StandardizedBadge variant="metric" size="sm">
                              {formatDualAllocationValue(member.hours || 0, workWeekHours, displayPreference)}
                            </StandardizedBadge>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={8} className="bg-popover border border-border shadow-lg p-3 max-w-xs">
                        <div className="space-y-2">
                          <div className="font-semibold text-sm text-foreground border-b border-border pb-2">
                            {member.name}
                          </div>
                          {member.allProjects && member.allProjects.length > 0 ? (
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground mb-1">Projects this week:</div>
                              {member.allProjects.map((proj: any, pIdx: number) => (
                                <div key={pIdx} className="flex justify-between items-center text-xs">
                                  <span className="text-foreground truncate max-w-[140px]">
                                    {getProjectDisplayName(proj, projectDisplayPreference)}
                                  </span>
                                  <span className="text-muted-foreground font-medium ml-2">
                                    {formatDualAllocationValue(proj.hours, workWeekHours, displayPreference)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t border-border pt-1 mt-2 flex justify-between font-semibold text-xs text-foreground">
                                <span>Total:</span>
                                <span>{formatDualAllocationValue(member.totalHours || member.hours || 0, workWeekHours, displayPreference)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {formatDualAllocationValue(member.hours || 0, workWeekHours, displayPreference)} on this project
                            </div>
                          )}
                          <div className="text-[10px] text-muted-foreground pt-1 border-t border-border">
                            Click to add hours or leave
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </MemberVacationPopover>
              ))}
              {project.teamMembers && project.teamMembers.length > 8 && (
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  +{project.teamMembers.length - 8}
                </div>
              )}
            </div>
          </div>

          {/* Footer Row - Stats on left, Add + Edit on right */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold">{project.teamMembers?.length || 0}</span>
                <span className="text-[10px] text-muted-foreground">team</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold">{formatAllocationValue(totalHours, teamCapacity, displayPreference)}</span>
                <span className="text-[10px] text-muted-foreground">total</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <AddTeamMemberAllocation
                projectId={project.id}
                weekStartDate={weekStartDate}
                variant="compact"
              />
              <Button 
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDialogOpen(true);
                }}
                className="h-7 w-7"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditProjectAllocationsDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={project}
        selectedWeek={new Date()}
      />
    </>
  );
});