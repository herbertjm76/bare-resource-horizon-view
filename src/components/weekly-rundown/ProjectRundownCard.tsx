import React, { useState } from 'react';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { MapPin, Users, Clock, Activity, Briefcase, Building, Palette, Code, Sparkles, Rocket, Target, Zap, TrendingUp, Circle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamMemberAvatar } from './TeamMemberAvatar';
import { AddTeamMemberAllocation } from './AddTeamMemberAllocation';
import { EditProjectAllocationsDialog } from './EditProjectAllocationsDialog';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import * as LucideIcons from 'lucide-react';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { useAppSettings } from '@/hooks/useAppSettings';
import { usePermissions } from '@/hooks/usePermissions';
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

export const ProjectRundownCard: React.FC<ProjectRundownCardProps> = React.memo(({
  project,
  isActive,
  isFullscreen,
  selectedWeek,
  onDataChange
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { departments } = useOfficeSettings();
  const { projectDisplayPreference, startOfWorkWeek, workWeekHours, displayPreference } = useAppSettings();
  const { isAtLeastRole } = usePermissions();
  const canManageAllocations = isAtLeastRole('admin');
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
      h-full
      transition-all duration-500 ease-out
      flex flex-col
    `}>
      {/* Hero Section - Responsive */}
      <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0">
        <div className="flex items-start gap-1.5 sm:gap-2">
          {/* Small Line Art Icon */}
          <div className="relative flex-shrink-0 mt-0.5">
            <ProjectIcon className={`${isFullscreen ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-3 w-3 sm:h-4 sm:w-4'} text-primary`} />
          </div>
          
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-start justify-between gap-1.5 sm:gap-2">
              <div className="flex-1 min-w-0">
                {/* Project Primary Display */}
                <h1 className="font-bold text-foreground tracking-tight mb-0.5 text-2xl sm:text-3xl truncate">
                  {primaryDisplay}
                </h1>
                
                {/* Project Secondary Display */}
                {secondaryDisplay && (
                  <h2 className="font-medium text-muted-foreground text-sm sm:text-base truncate">
                    {secondaryDisplay}
                  </h2>
                )}
              </div>
              
              {/* Badges - Responsive flex wrap */}
              <div className="flex flex-wrap items-end justify-end gap-1 sm:gap-1.5 flex-shrink-0 max-w-[50%]">
                <StandardizedBadge variant="metric" size="sm" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {formatDualAllocationValue(project.totalHours, teamCapacity, displayPreference)}
                </StandardizedBadge>
                <StandardizedBadge variant="secondary" size="sm" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  {project.teamMembers.length}
                </StandardizedBadge>
                {project.office && (
                  <StandardizedBadge variant="secondary" size="sm" className="text-xs sm:text-sm px-2 py-1 truncate max-w-[70px] sm:max-w-none">
                    {project.office}
                  </StandardizedBadge>
                )}
                {project.status && (
                  <StandardizedBadge variant="status" size="sm" className="text-xs sm:text-sm px-2 py-1">
                    {project.status}
                  </StandardizedBadge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Avatars - Responsive */}
      <div className="px-3 sm:px-4 py-1.5 relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        {project.teamMembers.length > 0 ? (
          <div className="flex flex-col h-full min-h-0">
            {/* Centered team members - scrollable */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto min-h-0">
              <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center items-end content-center py-0.5">
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
            {/* Action buttons bottom right */}
            <div className="flex justify-end mt-0.5 gap-0.5 flex-shrink-0">
              {canManageAllocations && (
                <>
                  <AddTeamMemberAllocation
                    projectId={project.id}
                    weekStartDate={weekStartDateString}
                    existingMemberIds={project.teamMembers.map(m => m.id)}
                    onAdd={onDataChange}
                    variant="compact"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <Pencil className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="text-center py-2 sm:py-4 bg-muted/20 rounded-lg border border-border/30">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted/30 mb-1">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-[10px] sm:text-xs">No team members allocated</p>
              </div>
            </div>
            <div className="flex justify-end mt-1 gap-0.5 flex-shrink-0">
              {canManageAllocations && (
                <>
                  <AddTeamMemberAllocation
                    projectId={project.id}
                    weekStartDate={weekStartDateString}
                    existingMemberIds={[]}
                    onAdd={onDataChange}
                    variant="compact"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <Pencil className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <EditProjectAllocationsDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={project}
        selectedWeek={selectedWeek}
      />
    </div>
  );
});