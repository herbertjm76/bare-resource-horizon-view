import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, FolderOpen } from 'lucide-react';

interface ProjectRundownCardProps {
  project: {
    id: string;
    name: string;
    code: string;
    color?: string;
    totalHours: number;
    status?: string;
    office?: string;
    teamMembers: Array<{
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
      location: string;
      hours: number;
      capacityPercentage: number;
    }>;
  };
  isActive: boolean;
  isFullscreen: boolean;
}

export const ProjectRundownCard: React.FC<ProjectRundownCardProps> = ({
  project,
  isActive,
  isFullscreen
}) => {
  const getCapacityColor = (percentage: number) => {
    if (percentage > 100) return 'text-destructive';
    if (percentage >= 90) return 'text-orange-500';
    if (percentage >= 60) return 'text-green-500';
    return 'text-muted-foreground';
  };

  const sortedMembers = [...project.teamMembers].sort((a, b) => b.hours - a.hours);

  return (
    <div className={`
      relative rounded-3xl glass-card glass-hover p-8 shadow-2xl
      ${isActive ? 'ring-2 ring-primary/50 glass-elevated' : ''}
      ${isFullscreen ? 'min-h-[80vh]' : 'min-h-[500px]'}
      transition-all duration-500 ease-out
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      overflow-hidden
    `}>
      {/* Header */}
      <div className="flex items-start gap-6 mb-8 relative z-10">
        <div 
          className={`${isFullscreen ? 'h-20 w-20' : 'h-16 w-16'} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl ring-4 ring-white/20 backdrop-blur-sm`}
          style={{ 
            background: `linear-gradient(135deg, ${project.color || 'hsl(var(--primary))'}, ${project.color || 'hsl(var(--primary))'}80)`
          }}
        >
          <FolderOpen className={isFullscreen ? 'h-10 w-10' : 'h-8 w-8'} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className={`font-bold text-foreground mb-2 ${
            isFullscreen ? 'text-4xl' : 'text-3xl'
          }`}>
            {project.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="text-base px-3 py-1">
              {project.code}
            </Badge>
            
            {project.office && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {project.office}
              </Badge>
            )}
            
            {project.status && (
              <Badge variant="secondary">
                {project.status}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold text-foreground ${
            isFullscreen ? 'text-2xl' : 'text-xl'
          }`}>
            Weekly Allocation
          </h2>
          <div className="text-right">
            <div className={`font-bold text-foreground ${
              isFullscreen ? 'text-3xl' : 'text-2xl'
            }`}>
              {project.totalHours}h
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {project.teamMembers.length} team member{project.teamMembers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      {project.teamMembers.length > 0 && (
        <div className="relative z-10">
          <h3 className={`font-semibold text-foreground mb-6 ${
            isFullscreen ? 'text-xl' : 'text-lg'
          }`}>
            Team Allocation
          </h3>
          
          <div className="space-y-4">
            {sortedMembers.map((member) => (
              <div key={member.id} className="glass rounded-xl p-4 hover:glass-elevated transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                   <Avatar className="h-10 w-10 ring-2 ring-white/20 shadow-lg">
                     <AvatarImage src={member.avatar_url} />
                     <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm backdrop-blur-sm">
                       {(member.first_name || '').charAt(0)}{(member.last_name || '').charAt(0)}
                     </AvatarFallback>
                   </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {member.location}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {member.hours}h
                        </div>
                        <div className={`text-sm font-medium ${getCapacityColor(member.capacityPercentage)}`}>
                          {member.capacityPercentage.toFixed(0)}% capacity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(member.capacityPercentage, 100)} 
                  className="h-2"
                />
                
                {member.capacityPercentage > 100 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                    <Clock className="h-3 w-3" />
                    Overallocated by {(member.capacityPercentage - 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {project.teamMembers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No team members allocated this week</p>
        </div>
      )}
    </div>
  );
};