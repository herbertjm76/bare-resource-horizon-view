import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Clock, AlertTriangle, CheckCircle, Calendar, TrendingUp, Pencil } from 'lucide-react';
import { ProjectAllocationSegment } from './ProjectAllocationSegment';
import { AddProjectAllocation } from './AddProjectAllocation';
import { OtherLeaveSection } from './OtherLeaveSection';
import { EditPersonAllocationsDialog } from './EditPersonAllocationsDialog';
import { format } from 'date-fns';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useAppSettings } from '@/hooks/useAppSettings';
import { usePermissions } from '@/hooks/usePermissions';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { formatAllocationValue, formatDualAllocationValue, formatAvailableValue } from '@/utils/allocationDisplay';
import { getWeekStartDate } from '@/components/weekly-overview/utils';

interface PersonRundownCardProps {
  person: {
    id: string;
    first_name: string;
    last_name: string;
    location: string;
    department?: string;
    avatar_url?: string;
    totalHours: number;
    capacity: number;
    utilizationPercentage: number;
    projects: Array<{
      id: string;
      name: string;
      code: string;
      hours: number;
      percentage: number;
      color?: string;
    }>;
    leave?: {
      annualLeave: number;
      vacationLeave: number;
      medicalLeave: number;
      publicHoliday: number;
    };
  };
  isActive: boolean;
  isFullscreen: boolean;
  selectedWeek?: Date;
  onDataChange?: () => void;
}

export const PersonRundownCard: React.FC<PersonRundownCardProps> = React.memo(({
  person,
  isActive,
  isFullscreen,
  selectedWeek = new Date(),
  onDataChange
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { projectDisplayPreference, displayPreference, startOfWorkWeek } = useAppSettings();
  const { isAtLeastRole } = usePermissions();
  const canManageAllocations = isAtLeastRole('admin');

  const getUtilizationStatus = (percentage: number) => {
    if (percentage > 100) return { color: 'destructive', label: 'Overloaded', icon: AlertTriangle };
    if (percentage >= 90) return { color: 'warning', label: 'High Utilization', icon: AlertTriangle };
    if (percentage >= 60) return { color: 'success', label: 'Well Utilized', icon: CheckCircle };
    return { color: 'secondary', label: 'Under Utilized', icon: Clock };
  };

  const status = getUtilizationStatus(person.utilizationPercentage);
  const StatusIcon = status.icon;

  const totalLeaveHours = person.leave 
    ? person.leave.annualLeave + person.leave.vacationLeave + person.leave.medicalLeave + person.leave.publicHoliday
    : 0;
  const availableHours = Math.max(0, person.capacity - person.totalHours - totalLeaveHours);
 
   const weekStartDate = format(getWeekStartDate(selectedWeek, startOfWorkWeek), 'yyyy-MM-dd');
  
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
    onDataChange?.();
  };

  return (
    <TooltipProvider>
      <div className={`
        relative rounded-3xl bg-card shadow-2xl border border-border
        ${isActive ? 'ring-2 ring-primary/50 scale-[1.02]' : ''}
        h-full
        transition-all duration-500 ease-out
        overflow-hidden
        flex flex-col
      `}>
        {/* Hero Section - Responsive */}
        <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0">
          <div className="flex items-start gap-2 sm:gap-3">
            <Avatar className={`${isFullscreen ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-8 w-8 sm:h-10 sm:w-10'} ring-1 sm:ring-2 ring-primary/20 shadow-lg transition-transform hover:scale-105 flex-shrink-0`}>
              <AvatarImage src={person.avatar_url} />
              <AvatarFallback className="text-xs sm:text-sm font-bold bg-gradient-modern text-white backdrop-blur-sm">
                {person.first_name.charAt(0)}{person.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-0.5">
                <h1 className={`font-bold text-foreground tracking-tight truncate ${
                  isFullscreen ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                }`}>
                  {person.first_name} {person.last_name}
                </h1>
                
                {/* Badges - Responsive flex wrap */}
                <div className="flex flex-wrap items-end justify-end gap-1 sm:gap-1.5 flex-shrink-0 max-w-[50%]">
                  <Badge variant="outline" className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    {person.utilizationPercentage}%
                  </Badge>
                  {person.department && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                      {person.department}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {person.location}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Bar Graph with Inline Editing - Responsive */}
        <div className="px-3 sm:px-4 py-1.5 relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="w-full flex flex-col min-h-0 flex-1">
            <h2 className={`font-semibold text-foreground mb-1 sm:mb-1.5 flex-shrink-0 ${
              isFullscreen ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}>
              Weekly Allocation
            </h2>
          
          <div className="w-full h-7 sm:h-8 bg-muted/20 rounded-md sm:rounded-lg overflow-hidden flex shadow-inner border border-border/30 flex-shrink-0">
            {/* Project Segments */}
            {person.projects && person.projects.length > 0 && person.projects.map((project: any, idx: number) => {
              return (
                <ProjectAllocationSegment
                  key={`${project.id}-${refreshKey}`}
                  project={project}
                  capacity={person.capacity}
                  color={generateMonochromaticShades(idx, person.projects.length)}
                />
              );
            })}
            
            {/* Leave Segment */}
            {totalLeaveHours > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-full flex items-center justify-center text-foreground font-semibold text-[10px] sm:text-xs cursor-pointer hover:brightness-110 transition-all border-r border-border/30"
                    style={{
                      width: `${(totalLeaveHours / person.capacity) * 100}%`,
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                    }}
                  >
                    <span>🏖️ {formatAllocationValue(totalLeaveHours, person.capacity, displayPreference)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Leave</p>
                  <p className="text-xs">
                    {formatAllocationValue(totalLeaveHours, person.capacity, displayPreference)} total
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Unallocated Segment */}
            {availableHours > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-full flex items-center justify-center text-muted-foreground font-medium text-[10px] sm:text-xs cursor-pointer hover:bg-muted/40 transition-all"
                    style={{
                      width: `${(availableHours / person.capacity) * 100}%`,
                      backgroundColor: 'hsl(var(--muted))',
                    }}
                  >
                    <span>
                      Available {formatDualAllocationValue(availableHours, person.capacity, displayPreference)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Unallocated Hours</p>
                  <p className="text-xs">
                    {formatAvailableValue(availableHours, person.capacity, displayPreference)} available
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
            {/* Project List - Scrollable with flex sizing */}
            {person.projects && person.projects.length > 0 && (
              <div className="mt-1 sm:mt-1.5 space-y-0.5 sm:space-y-1 flex-1 min-h-0 overflow-y-auto">
                {person.projects.slice(0, 8).map((project, idx) => {
                  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
                  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);
                  return (
                    <div key={`${project.id}-list-${idx}`} className="flex items-center text-[8px] sm:text-[10px] project-list-item">
                      <div
                        className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 mr-1 sm:mr-1.5"
                        style={{ backgroundColor: generateMonochromaticShades(idx, person.projects.length) }}
                      />
                      <span className="font-semibold text-foreground mr-1 sm:mr-1.5 project-code truncate" data-project-code>{primaryDisplay}</span>
                      {secondaryDisplay && <span className="text-muted-foreground mr-1 sm:mr-1.5 truncate max-w-[80px] sm:max-w-[150px] project-name hidden sm:inline">{secondaryDisplay}</span>}
                      <StandardizedBadge variant="metric" size="sm" className="project-hours-badge text-[7px] sm:text-[9px] ml-auto flex-shrink-0">
                        {formatDualAllocationValue(project.hours, person.capacity, displayPreference)}
                      </StandardizedBadge>
                    </div>
                  );
                })}
                {person.projects.length > 8 && (
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground text-center pt-0.5">
                    +{person.projects.length - 8} more
                  </p>
                )}
              </div>
            )}
          
            {/* Action Buttons - Lower Right */}
            <div className="mt-1 sm:mt-1.5 flex justify-end gap-0.5 flex-shrink-0">
              {canManageAllocations && (
                <>
                  <AddProjectAllocation
                    memberId={person.id}
                    weekStartDate={weekStartDate}
                    existingProjectIds={person.projects.map(p => p.id)}
                    onAdd={handleDataChange}
                    variant="compact"
                  />
                  <OtherLeaveSection
                    memberId={person.id}
                    weekStartDate={weekStartDate}
                    onUpdate={handleDataChange}
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
        </div>

      </div>
      
      <EditPersonAllocationsDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        person={person}
        selectedWeek={selectedWeek}
      />
    </TooltipProvider>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.person.id === nextProps.person.id &&
    prevProps.person.totalHours === nextProps.person.totalHours &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isFullscreen === nextProps.isFullscreen &&
    JSON.stringify(prevProps.person.projects) === JSON.stringify(nextProps.person.projects) &&
    JSON.stringify(prevProps.person.leave) === JSON.stringify(nextProps.person.leave)
  );
});