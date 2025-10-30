import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';
import { EditableTeamMemberAllocation } from './EditableTeamMemberAllocation';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';

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
      relative rounded-3xl glass-card glass-hover p-8 shadow-2xl
      ${isActive ? 'ring-2 ring-primary/50 glass-elevated' : ''}
      ${isFullscreen ? 'min-h-[80vh]' : 'min-h-[500px]'}
      transition-all duration-500 ease-out
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      overflow-hidden
    `}>
      {/* Header */}
      <div className="flex items-start gap-6 mb-8 relative z-10">
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
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No team members allocated this week</p>
        </div>
      )}
    </div>
  );
};