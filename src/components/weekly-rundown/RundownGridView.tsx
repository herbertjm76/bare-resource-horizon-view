import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Calendar, Building } from 'lucide-react';
import { RundownMode } from './WeeklyRundownView';

interface RundownGridViewProps {
  items: any[];
  rundownMode: RundownMode;
  isFullscreen: boolean;
}

export const RundownGridView: React.FC<RundownGridViewProps> = ({
  items,
  rundownMode,
  isFullscreen
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
  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'hsl(var(--destructive))';
    if (utilization >= 90) return 'hsl(39, 100%, 50%)';
    if (utilization >= 75) return 'hsl(120, 100%, 40%)';
    return 'hsl(var(--muted-foreground))';
  };

  const getUtilizationStatus = (utilization: number) => {
    if (utilization > 100) return { label: 'Over', color: 'destructive' };
    if (utilization >= 90) return { label: 'High', color: 'warning' };
    if (utilization >= 75) return { label: 'Good', color: 'success' };
    return { label: 'Low', color: 'secondary' };
  };

  const status = getUtilizationStatus(person.utilization || 0);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="glass-card glass-hover rounded-2xl border-0 p-5 cursor-pointer overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500">
          {/* Gradient overlay */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-2xl" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <Avatar className="h-12 w-12 ring-4 ring-white/20 shadow-xl">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback className="bg-gradient-modern text-white backdrop-blur-sm">
                {person.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate mb-1">{person.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{person.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <Badge variant={status.color as any} className="text-xs rounded-full px-2 py-1">
                {Math.round(person.utilization || 0)}%
              </Badge>
            </div>

            <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(person.utilization || 0, 100)}%`,
                  backgroundColor: getUtilizationColor(person.utilization || 0)
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="font-medium">{person.resourcedHours || 0}h / {person.capacity || 40}h</span>
              <span className="font-medium">{person.projects?.length || 0} projects</span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm glass-card border-0 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback>{person.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{person.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {person.location}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Weekly Hours:</span>
              <span className="font-mono">{person.resourcedHours || 0}h / {person.capacity || 40}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Utilization:</span>
              <span className="font-mono">{Math.round(person.utilization || 0)}%</span>
            </div>
          </div>

          {person.projects && person.projects.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Project Allocations:</p>
              <div className="space-y-1">
                {person.projects.slice(0, 3).map((project: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1">{project.projectName}</span>
                    <span className="font-mono ml-2">{project.hours}h</span>
                  </div>
                ))}
                {person.projects.length > 3 && (
                  <p className="text-xs text-muted-foreground">+{person.projects.length - 3} more</p>
                )}
              </div>
            </div>
          )}

          {(person.annualLeave > 0 || person.vacationLeave > 0 || person.medicalLeave > 0 || person.publicHoliday > 0) && (
            <div>
              <p className="text-sm font-medium mb-1">Leave Hours:</p>
              <div className="space-y-1 text-xs">
                {person.annualLeave > 0 && <div>Annual: {person.annualLeave}h</div>}
                {person.vacationLeave > 0 && <div>Vacation: {person.vacationLeave}h</div>}
                {person.medicalLeave > 0 && <div>Medical: {person.medicalLeave}h</div>}
                {person.publicHoliday > 0 && <div>Public Holiday: {person.publicHoliday}h</div>}
              </div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const ProjectGridCard: React.FC<{ project: any }> = ({ project }) => {
  const getCapacityColor = (percentage: number) => {
    if (percentage > 100) return 'hsl(var(--destructive))';
    if (percentage >= 90) return 'hsl(39, 100%, 50%)';
    if (percentage >= 75) return 'hsl(120, 100%, 40%)';
    return 'hsl(var(--muted-foreground))';
  };

  const averageCapacity = project.teamMembers?.length > 0 
    ? project.teamMembers.reduce((sum: number, member: any) => sum + (member.capacityPercentage || 0), 0) / project.teamMembers.length 
    : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="glass-card glass-hover rounded-2xl border-0 p-5 cursor-pointer overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500">
          {/* Gradient overlay */}
          <div 
            className="absolute top-0 right-0 w-16 h-16 rounded-bl-2xl opacity-20"
            style={{ 
              background: `linear-gradient(to bottom left, ${project.color || 'hsl(var(--primary))'}, transparent)`
            }}
          />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-lg ring-2 ring-white/20 bg-gradient-modern"
              >
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground font-medium">{project.code}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs rounded-full px-2 py-1">
              {project.status || 'Active'}
            </Badge>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Team Size</span>
              <span className="text-sm font-semibold">{project.teamMembers?.length || 0} members</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="text-lg font-bold text-primary">{Math.round(project.totalHours || 0)}h</span>
            </div>

            {project.teamMembers?.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Capacity</span>
                  <Badge 
                    variant={averageCapacity > 100 ? 'destructive' : averageCapacity >= 90 ? 'default' : 'secondary'}
                    className="text-xs rounded-full px-2 py-1"
                  >
                    {Math.round(averageCapacity)}%
                  </Badge>
                </div>

                <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${Math.min(averageCapacity, 100)}%`,
                      backgroundColor: getCapacityColor(averageCapacity)
                    }}
                  />
                </div>
              </>
            )}
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
                      <span className="font-mono">{Math.round(member.hours || 0)}h</span>
                      <Badge
                        variant={member.capacityPercentage > 100 ? 'destructive' : 'secondary'}
                        className="text-xs px-1 py-0"
                      >
                        {Math.round(member.capacityPercentage || 0)}%
                      </Badge>
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
  );
};