import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Calendar, Building, FolderOpen } from 'lucide-react';
import { RundownMode } from './WeeklyRundownView';
import { AvatarWithHourDial } from './AvatarWithHourDial';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';

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
  
  return (
    <div className="glass-card rounded-xl border p-4 hover:shadow-lg transition-all duration-300">
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
        <Badge 
          variant={
            person.utilization >= 100 ? "default" : 
            person.utilization >= 70 ? "warning" : 
            "destructive"
          }
          className="text-xs font-semibold px-2 py-1"
        >
          {Math.round(person.utilization || 0)}%
        </Badge>
      </div>

      {/* Stacked Bar Graph */}
      <div className="mb-3">
        <div className="w-full h-6 bg-muted/30 rounded-lg overflow-hidden flex">
          {person.projects && person.projects.length > 0 ? (
            person.projects.map((project: any, idx: number) => {
              const percentage = (project.hours / capacity) * 100;
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div
                      className="h-full transition-all hover:opacity-80 cursor-pointer"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: generateMonochromaticShades(idx, person.projects.length),
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">{project.name}</p>
                    <p>{project.hours}h ({Math.round(percentage)}%)</p>
                  </TooltipContent>
                </Tooltip>
              );
            })
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
              <span className="font-mono text-muted-foreground ml-2">{project.hours}h</span>
            </div>
          ))}
          {person.projects.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{person.projects.length - 5} more
            </p>
          )}
        </div>
      )}
    </div>
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

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="text-lg font-bold text-primary">{Math.round(project.totalHours || 0)}h</span>
            </div>

            {/* Team Member Avatars */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.slice(0, 8).map((member: any, idx: number) => (
                    <Tooltip key={idx}>
                      <TooltipTrigger>
                        <AvatarWithHourDial
                          avatar={member.avatar}
                          fallback={member.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          hours={member.hours || 0}
                          maxHours={40}
                          size="sm"
                          color={getCapacityColor(member.capacityPercentage || 0)}
                        />
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