import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Calendar, Building, Pencil, Circle } from 'lucide-react';
import { RundownMode } from './WeeklyRundownView';
import { AvatarWithHourDial } from './AvatarWithHourDial';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';
import { EditPersonAllocationsDialog } from './EditPersonAllocationsDialog';
import { EditProjectAllocationsDialog } from './EditProjectAllocationsDialog';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import * as LucideIcons from 'lucide-react';

interface RundownGridViewProps {
  items: any[];
  rundownMode: RundownMode;
  isFullscreen: boolean;
  selectedWeek: Date;
}

export const RundownGridView: React.FC<RundownGridViewProps> = ({
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
              <PersonGridCard person={item} />
            ) : (
              <ProjectGridCard project={item} />
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

const PersonGridCard: React.FC<{ person: any }> = ({ person }) => {
  const capacity = person.capacity || 40;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  return (
    <>
      <div className="glass-card rounded-xl border p-4 hover:shadow-lg transition-all duration-300 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
          <AvatarImage src={person.avatar} alt={person.name} />
          <AvatarFallback className="text-xs bg-gradient-modern text-white">
            {person.name?.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{person.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span className="truncate">{person.department || 'No Department'}</span>
          </div>
        </div>
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
      </div>

      {/* Stacked Bar Graph */}
      <div className="mb-3">
        <div className="w-full h-6 bg-muted/30 rounded-lg overflow-hidden flex relative">
          {person.projects && person.projects.length > 0 ? (
            (() => {
              let cumulative = 0;
              return person.projects.map((project: any, idx: number) => {
                const percentage = (project.hours / capacity) * 100;
                const startPercent = cumulative;
                cumulative += percentage;
                const isOverflow = startPercent >= 100; // This segment starts after 100%
                const isPartialOverflow = startPercent < 100 && cumulative > 100; // This segment crosses 100%
                
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
                      <p className="font-medium">{project.name}</p>
                      <p>{project.hours}h ({Math.round(percentage)}%)</p>
                    </TooltipContent>
                  </Tooltip>
                );
              });
            })()
          ) : (
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
                  {project.name}
                </span>
              </div>
              <StandardizedBadge variant="metric" size="sm" className="ml-2">{project.hours}h</StandardizedBadge>
            </div>
          ))}
          {person.projects.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{person.projects.length - 5} more
            </p>
          )}
        </div>
      )}

      {/* Edit Button */}
      <div className="flex justify-end mt-2">
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

    <EditPersonAllocationsDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      person={person}
      selectedWeek={new Date()}
    />
    </>
  );
};

const ProjectGridCard: React.FC<{ project: any }> = ({ project }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { departments } = useOfficeSettings();
  const { projectDisplayPreference } = useAppSettings();
  
  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);
  
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
    <Tooltip>
      <TooltipTrigger asChild>
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
              {((project.totalHours || 0) / 40).toFixed(1)} FTE
            </StandardizedBadge>
          </div>

          <div className="space-y-3 relative z-10">

            {/* Team Member Avatars */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {project.teamMembers.slice(0, 8).map((member: any, idx: number) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center gap-1.5">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-md">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs bg-gradient-modern text-white">
                              {member.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-center gap-0.5">
                            <p className="text-[10px] font-semibold text-foreground">{member.name?.split(' ')[0]}</p>
                            <StandardizedBadge variant="metric" size="sm">
                              {Math.round(member.hours || 0)}h
                            </StandardizedBadge>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p className="font-medium">{member.name}</p>
                        <p>{member.hours}h ({Math.round(member.capacityPercentage || 0)}% capacity)</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {project.teamMembers.length > 8 && (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      +{project.teamMembers.length - 8}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold">{project.teamMembers?.length || 0}</span>
                <span className="text-[10px] text-muted-foreground">team</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold">{project.totalHours || 0}h</span>
                <span className="text-[10px] text-muted-foreground">total</span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end mt-2">
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
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm glass-card border-0 shadow-2xl">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">{project.name}</h4>
            <p className="text-sm text-muted-foreground">{project.code}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              {project.office && (
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {project.office}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.round(project.totalHours || 0)}h total
              </span>
            </div>
          </div>

          {project.teamMembers && project.teamMembers.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Team Members ({project.teamMembers.length})
              </p>
              <div className="space-y-1">
                {project.teamMembers.slice(0, 5).map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{member.name}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <StandardizedBadge variant="metric" size="sm">{Math.round(member.hours || 0)}h</StandardizedBadge>
                      <StandardizedBadge
                        variant={member.capacityPercentage > 100 ? 'error' : 'secondary'}
                        size="sm"
                      >
                        {Math.round(member.capacityPercentage || 0)}%
                      </StandardizedBadge>
                    </div>
                  </div>
                ))}
                {project.teamMembers.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{project.teamMembers.length - 5} more members</p>
                )}
              </div>
            </div>
          )}

          {project.teamMembers?.length === 0 && (
            <div className="text-center py-2">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground/50 mb-1" />
              <p className="text-xs text-muted-foreground">No team members allocated</p>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>

    <EditProjectAllocationsDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      project={project}
      selectedWeek={new Date()}
    />
    </>
  );
};