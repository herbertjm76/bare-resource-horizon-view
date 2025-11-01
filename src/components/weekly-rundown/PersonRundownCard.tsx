import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Clock, AlertTriangle, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { EditableProjectAllocation } from './EditableProjectAllocation';
import { AddProjectAllocation } from './AddProjectAllocation';
import { format, startOfWeek } from 'date-fns';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import { generateMonochromaticShades } from '@/utils/themeColorUtils';

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

export const PersonRundownCard: React.FC<PersonRundownCardProps> = ({
  person,
  isActive,
  isFullscreen,
  selectedWeek = new Date(),
  onDataChange
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
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

  const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
    onDataChange?.();
  };

  return (
    <TooltipProvider>
      <div className={`
        relative rounded-3xl glass-card glass-hover shadow-2xl
        ${isActive ? 'ring-2 ring-primary/50 glass-elevated scale-[1.02]' : ''}
        ${isFullscreen ? 'h-[60vh]' : 'min-h-[500px]'}
        transition-all duration-500 ease-out
        before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
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
                
                {/* Badges - Department and Location */}
                <div className="flex flex-col items-end gap-1.5">
                  {person.department && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      {person.department}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs">
                    <MapPin className="h-3 w-3" />
                    {person.location}
                  </Badge>
                </div>
              </div>
              
              {/* Key Metrics Row */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    <CountUpNumber end={person.utilizationPercentage} duration={1500} />%
                  </span>
                  <span className="text-xs text-muted-foreground">utilization</span>
                </div>
                
                <div className="h-8 w-px bg-border" />
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    <CountUpNumber end={person.totalHours} duration={1500} />h
                  </span>
                  <span className="text-xs text-muted-foreground">/ {person.capacity}h</span>
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
                    <span>🏖️ {totalLeaveHours}h</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Leave</p>
                  <p className="text-xs">{totalLeaveHours}h total</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Unallocated Segment */}
            {person.totalHours + totalLeaveHours < person.capacity && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="h-full flex items-center justify-center text-muted-foreground font-medium text-sm cursor-pointer hover:bg-muted/40 transition-all"
                    style={{
                      width: `${((person.capacity - person.totalHours - totalLeaveHours) / person.capacity) * 100}%`,
                      backgroundColor: 'hsl(var(--muted))',
                    }}
                  >
                    <span>Available {person.capacity - person.totalHours - totalLeaveHours}h</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Unallocated Hours</p>
                  <p className="text-xs">{person.capacity - person.totalHours - totalLeaveHours}h available</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
            {/* Add Project Button */}
            <div className="mt-3">
              <AddProjectAllocation
                memberId={person.id}
                weekStartDate={weekStartDate}
                existingProjectIds={person.projects.map(p => p.id)}
                onAdd={handleDataChange}
              />
            </div>
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
};