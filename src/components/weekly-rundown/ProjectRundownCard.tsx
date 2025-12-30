import React from 'react';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { MapPin, Users, Clock, Activity, Briefcase, Building, Palette, Code, Sparkles, Rocket, Target, Zap, TrendingUp, Circle } from 'lucide-react';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import * as LucideIcons from 'lucide-react';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { formatDualAllocationValue } from '@/utils/allocationDisplay';

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
  const { projectDisplayPreference, startOfWorkWeek, workWeekHours, displayPreference } = useAppSettings();
  const sortedMembers = [...project.teamMembers].sort((a, b) => b.hours - a.hours);
  
  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);

  // Calculate week start based on company settings
  const weekStartDate = new Date(selectedWeek);
  const day = weekStartDate.getDay();
  let diff = 0;
  if (startOfWorkWeek === 'Monday') {
    diff = day === 0 ? -6 : 1 - day;
  } else if (startOfWorkWeek === 'Sunday') {
    diff = -day;
  } else if (startOfWorkWeek === 'Saturday') {
    diff = day === 6 ? 0 : -(day + 1);
  }
  weekStartDate.setDate(weekStartDate.getDate() + diff);
  const weekStartDateString = weekStartDate.toISOString().split('T')[0];

  const perFteCapacity = workWeekHours;
  const teamCapacity = perFteCapacity * Math.max(project.teamMembers.length || 0, 1);
  const totalValue = displayPreference === 'percentage'
    ? (teamCapacity > 0 ? (project.totalHours / teamCapacity) * 100 : 0)
    : project.totalHours;
  const totalUnit = displayPreference === 'percentage' ? '%' : 'h';

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
      relative rounded-3xl bg-card shadow-2xl border border-border
      ${isActive ? 'ring-2 ring-primary/50 scale-[1.02]' : ''}
      ${isFullscreen ? 'h-[50vh]' : 'min-h-[400px]'}
      transition-all duration-500 ease-out
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
                {/* Project Primary Display */}
                <h1 className={`font-bold text-foreground tracking-tight mb-1 ${
                  isFullscreen ? 'text-5xl' : 'text-4xl'
                }`}>
                  {primaryDisplay}
                </h1>
                
                {/* Project Secondary Display */}
                {secondaryDisplay && (
                  <h2 className={`font-semibold text-muted-foreground mb-0.5 ${
                    isFullscreen ? 'text-xl' : 'text-lg'
                  }`}>
                    {secondaryDisplay}
                  </h2>
                )}
                
                {/* Department - Tertiary */}
                {project.department && (
                  <p className="text-xs text-muted-foreground">
                    {project.department}
                  </p>
                )}
              </div>
              
              {/* Badges - Upper Right */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <StandardizedBadge variant="metric" size="sm" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDualAllocationValue(project.totalHours, teamCapacity, displayPreference)}
                </StandardizedBadge>
                {project.office && (
                  <StandardizedBadge variant="secondary" size="sm">
                    {project.office}
                  </StandardizedBadge>
                )}
                {project.status && (
                  <StandardizedBadge variant="status" size="sm">
                    {project.status}
                  </StandardizedBadge>
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
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Avatars */}
      <div className="px-6 py-8 relative z-10 flex-1 flex flex-col">
        {project.teamMembers.length > 0 ? (
          <div className="flex flex-col h-full">
            {/* Centered team members */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-wrap gap-4 justify-center items-end">
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
            </div>
            {/* Add button bottom right */}
            <div className="flex justify-end mt-4">
              <AddTeamMemberAllocation
                projectId={project.id}
                weekStartDate={weekStartDateString}
                existingMemberIds={project.teamMembers.map(m => m.id)}
                onAdd={onDataChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-6 bg-muted/20 rounded-xl border border-border/30">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted/30 mb-2">
                  <Users className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No team members allocated this week</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <AddTeamMemberAllocation
                projectId={project.id}
                weekStartDate={weekStartDateString}
                existingMemberIds={[]}
                onAdd={onDataChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};