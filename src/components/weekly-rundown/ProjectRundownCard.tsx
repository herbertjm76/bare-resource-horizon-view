import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Activity, Briefcase, Building, Palette, Code, Sparkles, Rocket, Target, Zap, TrendingUp, Circle } from 'lucide-react';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import * as LucideIcons from 'lucide-react';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';

interface ProjectRundownCardProps {
  project: {
    id: string;
    name: string;
    code: string;
    color?: string;
    totalHours: number;
    status?: string;
    office?: string;
    department?: string;
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
  const { departments } = useOfficeSettings();
  const sortedMembers = [...project.teamMembers].sort((a, b) => b.hours - a.hours);
  
  const weekStartDate = new Date(selectedWeek);
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1);
  const weekStartDateString = weekStartDate.toISOString().split('T')[0];

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
    <div className={`
      relative rounded-3xl glass-card glass-hover shadow-2xl
      ${isActive ? 'ring-2 ring-primary/50 glass-elevated scale-[1.02]' : ''}
      ${isFullscreen ? 'min-h-[70vh]' : 'min-h-[400px]'}
      transition-all duration-500 ease-out
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      overflow-hidden
      flex flex-col
    `}>
      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl p-6">
        <div className="flex items-start gap-3">
          {/* Small Line Art Icon */}
          <div className="relative flex-shrink-0 mt-1">
            <ProjectIcon className={`${isFullscreen ? 'h-8 w-8' : 'h-7 w-7'} text-primary`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Project Code - Large and prominent */}
                <h1 className={`font-bold text-foreground tracking-tight mb-1 ${
                  isFullscreen ? 'text-5xl' : 'text-4xl'
                }`}>
                  {project.code}
                </h1>
                
                {/* Project Name - Secondary */}
                <h2 className={`font-semibold text-muted-foreground mb-0.5 ${
                  isFullscreen ? 'text-xl' : 'text-lg'
                }`}>
                  {project.name}
                </h2>
                
                {/* Department - Tertiary */}
                {project.department && (
                  <p className="text-xs text-muted-foreground">
                    {project.department}
                  </p>
                )}
              </div>
              
              {/* Badges - Upper Right */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold">
                  <Clock className="h-3 w-3" />
                  {project.totalHours}h
                </Badge>
                {project.office && (
                  <Badge variant="outline" className="flex items-center gap-1 px-2.5 py-1 text-xs">
                    {project.office}
                  </Badge>
                )}
                {project.status && (
                  <Badge variant="secondary" className="px-2.5 py-1 text-xs">
                    {project.status}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Key Metrics Row */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  <CountUpNumber end={project.teamMembers.length} duration={1500} />
                </span>
                <span className="text-xs text-muted-foreground">team</span>
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

      {/* Team Members Avatars */}
      <div className="px-6 py-8 relative z-10 flex items-center justify-center flex-1">
        {project.teamMembers.length > 0 ? (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {sortedMembers.map((member) => (
                <TeamMemberAvatar
                  key={member.id}
                  member={member}
                  projectId={project.id}
                  weekStartDate={weekStartDateString}
                  onUpdate={onDataChange}
                />
              ))}
            </div>
            
            <div className="flex justify-center">
              <AddTeamMemberAllocation
                projectId={project.id}
                weekStartDate={weekStartDateString}
                existingMemberIds={project.teamMembers.map(m => m.id)}
                onAdd={onDataChange}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/20 rounded-xl border border-border/30">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/30 mb-2">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-3">No team members allocated this week</p>
            <AddTeamMemberAllocation
              projectId={project.id}
              weekStartDate={weekStartDateString}
              existingMemberIds={[]}
              onAdd={onDataChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};