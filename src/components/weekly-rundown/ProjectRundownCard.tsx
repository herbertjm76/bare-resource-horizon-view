import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Briefcase, Activity } from 'lucide-react';
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
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl p-8 pb-6">
        <div className="flex items-start gap-6">
          {/* Large Project Avatar with Hours Badge */}
          <div className="relative">
            <div className={`${isFullscreen ? 'h-24 w-24' : 'h-20 w-20'} rounded-2xl bg-gradient-modern flex items-center justify-center ring-4 ring-primary/20 shadow-2xl transition-transform hover:scale-105`}>
              <Briefcase className={`${isFullscreen ? 'h-12 w-12' : 'h-10 w-10'} text-white`} />
            </div>
            {/* Hours Badge on Avatar */}
            <Badge className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground shadow-lg px-2 py-1 text-xs font-bold">
              <Clock className="h-3 w-3 mr-1" />
              {project.totalHours}h
            </Badge>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className={`font-bold text-foreground tracking-tight ${
                isFullscreen ? 'text-5xl' : 'text-4xl'
              }`}>
                {project.name}
              </h1>
              
              {/* Badges - Upper Right */}
              <div className="flex flex-col items-end gap-1.5">
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium">
                  <Activity className="h-3 w-3" />
                  {project.code}
                </Badge>
                {project.office && (
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                    <MapPin className="h-3 w-3" />
                    {project.office}
                  </Badge>
                )}
                {project.status && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    {project.status}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Key Metrics Row */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  <CountUpNumber end={project.teamMembers.length} duration={1500} />
                </span>
                <span className="text-xs text-muted-foreground">team members</span>
              </div>
              
              <div className="h-8 w-px bg-border" />
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  <CountUpNumber end={project.totalHours} duration={1500} />h
                </span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="px-8 mb-8 relative z-10">
        <h2 className={`font-semibold text-foreground mb-3 ${
          isFullscreen ? 'text-xl' : 'text-lg'
        }`}>
          Team Allocation
        </h2>
        
        {project.teamMembers.length > 0 ? (
          <div className="space-y-3">
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
            
            <div className="mt-3">
              <AddTeamMemberAllocation
                projectId={project.id}
                weekStartDate={weekStartDateString}
                existingMemberIds={project.teamMembers.map(m => m.id)}
                onAdd={onDataChange}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-xl border border-border/30">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-3">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No team members allocated this week</p>
          </div>
        )}
      </div>
    </div>
  );
};