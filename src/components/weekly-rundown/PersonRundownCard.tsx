import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Clock, AlertTriangle, CheckCircle, Calendar, TrendingUp, Pencil } from 'lucide-react';
import { EditableProjectAllocation } from './EditableProjectAllocation';
import { AddProjectAllocation } from './AddProjectAllocation';
import { OtherLeaveSection } from './OtherLeaveSection';
import { EditPersonAllocationsDialog } from './EditPersonAllocationsDialog';
import { format } from 'date-fns';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useAppSettings } from '@/hooks/useAppSettings';
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
        {/* Hero Section */}
        <div className="relative z-10 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent rounded-t-3xl p-8 pb-6">
          <div className="flex items-start gap-6">
            <Avatar className={`${isFullscreen ? 'h-24 w-24' : 'h-20 w-20'} ring-4 ring-primary/20 shadow-2xl transition-transform hover:scale-105`}>
              <AvatarImage src={person.avatar_url} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-modern text-white backdrop-blur-sm">
                {person.first_name.charAt(0)}{person.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className={`font-bold text-foreground tracking-tight ${
                  isFullscreen ? 'text-5xl' : 'text-4xl'
                }`}>
                  {person.first_name} {person.last_name}
                </h1>
                
                {/* Badges - Department, Location, and Utilization */}
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                    <TrendingUp className="h-3 w-3" />
                    {person.utilizationPercentage}% utilized
                  </Badge>
                  {person.department && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                      {person.department}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                    <MapPin className="h-3 w-3" />
                    {person.location}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Bar Graph with Inline Editing */}
        <div className="px-8 py-8 relative z-10 flex-1 flex flex-col items-center justify-center">
          <div className="w-full">
            <h2 className={`font-semibold text-foreground mb-3 ${
              isFullscreen ? 'text-xl' : 'text-lg'
            }`}>
              Weekly Allocation
            </h2>
          
          <div className="w-full h-16 bg-muted/20 rounded-xl overflow-hidden flex shadow-inner border border-border/30">
            {/* Project Segments */}
            {person.projects && person.projects.length > 0 && person.projects.map((project: any, idx: number) => {
              const percentage = (project.hours / person.capacity) * 100;
              // Calculate other projects hours (excluding current project)
              const otherProjectsHours = person.projects
                .filter((p: any) => p.id !== project.id)
                .reduce((sum: number, p: any) => sum + (p.hours || 0), 0);
              
              return (
                <EditableProjectAllocation
                  key={`${project.id}-${refreshKey}`}
                  memberId={person.id}
                  projectId={project.id}
                  projectName={project.name}
                  projectCode={project.code}
                  hours={project.hours}
                  percentage={percentage}
                  color={generateMonochromaticShades(idx, person.projects.length)}
                  weekStartDate={weekStartDate}
                  capacity={person.capacity}
                  totalOtherHours={otherProjectsHours}
                  leaveHours={totalLeaveHours}
                  onUpdate={handleDataChange}
                />
              );
            })}
            
            {/* Leave Segment */}
            {totalLeaveHours > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-full flex items-center justify-center text-foreground font-semibold text-sm cursor-pointer hover:brightness-110 transition-all border-r border-border/30"
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
                    className="h-full flex items-center justify-center text-muted-foreground font-medium text-sm cursor-pointer hover:bg-muted/40 transition-all"
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
          
            {/* Project List */}
            {person.projects && person.projects.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
                {person.projects.slice(0, 8).map((project, idx) => {
                  const primaryDisplay = getProjectDisplayName(project, projectDisplayPreference);
                  const secondaryDisplay = getProjectSecondaryText(project, projectDisplayPreference);
                  return (
                    <div key={`${project.id}-list-${idx}`} className="flex items-center text-xs project-list-item">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mr-2"
                        style={{ backgroundColor: generateMonochromaticShades(idx, person.projects.length) }}
                      />
                      <span className="font-semibold text-foreground mr-2 project-code" data-project-code>{primaryDisplay}</span>
                      {secondaryDisplay && <span className="text-muted-foreground mr-2 truncate max-w-[200px] project-name">{secondaryDisplay}</span>}
                      <StandardizedBadge variant="metric" size="sm" className="project-hours-badge">
                        {formatDualAllocationValue(project.hours, person.capacity, displayPreference)}
                      </StandardizedBadge>
                    </div>
                  );
                })}
                {person.projects.length > 8 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{person.projects.length - 8} more projects
                  </p>
                )}
              </div>
            )}
          
            {/* Action Buttons - Lower Right */}
            <div className="mt-3 flex justify-end gap-1">
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
                className="h-7 w-7"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
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