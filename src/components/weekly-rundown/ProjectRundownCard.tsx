import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Briefcase } from 'lucide-react';
import { EditableTeamMemberAllocation } from './EditableTeamMemberAllocation';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';
import { CountUpNumber } from '@/components/common/CountUpNumber';

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
      name: string;
      avatar?: string;
      location: string;
      hours: number;
      capacityPercentage: number;
    }>;
  };
  isActive: boolean;
  isFullscreen: boolean;
  selectedWeek: Date;
  onDataChange: () => void;
}

export const ProjectRundownCard: React.FC<ProjectRundownCardProps> = ({
  project,
  isActive,
  isFullscreen,
  selectedWeek,
  onDataChange
}) => {
  const sortedMembers = [...project.teamMembers].sort((a, b) => b.hours - a.hours);
  
  const weekStartDate = new Date(selectedWeek);
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1);
  const weekStartDateString = weekStartDate.toISOString().split('T')[0];

  return (
    <div className={`
      relative rounded-3xl glass-card glass-hover shadow-2xl
      ${isActive ? 'ring-2 ring-primary/50 glass-elevated scale-[1.02]' : ''}
      ${isFullscreen ? 'min-h-[80vh]' : 'min-h-[500px]'}
      transition-all duration-500 ease-out
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      overflow-hidden
    `}>
      {/* Hero Section with Key Metrics */}
      <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl p-8 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <div className={`${isFullscreen ? 'h-24 w-24' : 'h-20 w-20'} rounded-2xl bg-gradient-modern flex items-center justify-center ring-4 ring-primary/20 shadow-2xl transition-transform hover:scale-105`}>
            <Briefcase className={`${isFullscreen ? 'h-12 w-12' : 'h-10 w-10'} text-white`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className={`font-bold text-foreground mb-3 tracking-tight ${
              isFullscreen ? 'text-5xl' : 'text-4xl'
            }`}>
              {project.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-base px-3 py-1.5 font-medium">
                {project.code}
              </Badge>
              
              {project.office && (
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.office}
                </Badge>
              )}
              
              {project.status && (
                <Badge variant="secondary" className="px-3 py-1.5">
                  {project.status}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Hours</p>
            </div>
            <p className={`font-bold text-foreground ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
              <CountUpNumber end={project.totalHours} duration={1500} suffix="h" />
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Team Members</p>
            </div>
            <p className={`font-bold text-foreground ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
              <CountUpNumber end={project.teamMembers.length} duration={1000} />
            </p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      {project.teamMembers.length > 0 && (
        <div className="px-8 relative z-10">
          <h3 className={`font-semibold text-foreground mb-5 flex items-center gap-2 ${
            isFullscreen ? 'text-xl' : 'text-lg'
          }`}>
            <span>Team Allocation</span>
            <Badge variant="secondary" className="text-xs">{project.teamMembers.length}</Badge>
          </h3>
          
          <div className="space-y-4">
            {sortedMembers.map((member) => (
              <EditableTeamMemberAllocation
                key={member.id}
                member={member}
                projectId={project.id}
                weekStartDate={weekStartDateString}
                capacity={40}
                onUpdate={onDataChange}
              />
            ))}
            
            <AddTeamMemberAllocation
              projectId={project.id}
              weekStartDate={weekStartDateString}
              existingMemberIds={project.teamMembers.map(m => m.id)}
              onAdd={onDataChange}
            />
          </div>
        </div>
      )}

      {project.teamMembers.length === 0 && (
        <div className="px-8 text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">No team members allocated this week</p>
        </div>
      )}
    </div>
  );
};