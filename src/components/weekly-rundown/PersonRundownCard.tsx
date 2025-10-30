import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, AlertTriangle, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { EditableProjectAllocation } from './EditableProjectAllocation';
import { AddProjectAllocation } from './AddProjectAllocation';
import { format, startOfWeek } from 'date-fns';
import { CountUpNumber } from '@/components/common/CountUpNumber';

interface PersonRundownCardProps {
  person: {
    id: string;
    first_name: string;
    last_name: string;
    location: string;
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
          <Avatar className={`${isFullscreen ? 'h-24 w-24' : 'h-20 w-20'} ring-4 ring-primary/20 shadow-2xl transition-transform hover:scale-105`}>
            <AvatarImage src={person.avatar_url} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-modern text-white backdrop-blur-sm">
              {person.first_name.charAt(0)}{person.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h1 className={`font-bold text-foreground mb-3 tracking-tight ${
              isFullscreen ? 'text-5xl' : 'text-4xl'
            }`}>
              {person.first_name} {person.last_name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {person.location}
              </Badge>
              
              <Badge 
                variant={status.color as any}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utilization</p>
            </div>
            <p className={`font-bold text-foreground ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
              <CountUpNumber end={person.utilizationPercentage} duration={1500} suffix="%" />
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hours Allocated</p>
            </div>
            <p className={`font-bold text-foreground ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
              <CountUpNumber end={person.totalHours} duration={1500} suffix="h" />
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Projects</p>
            </div>
            <p className={`font-bold text-foreground ${isFullscreen ? 'text-4xl' : 'text-3xl'}`}>
              <CountUpNumber end={person.projects.length} duration={1000} />
            </p>
          </div>
        </div>
      </div>

      {/* Animated Progress Section */}
      <div className="px-8 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-semibold text-foreground ${
            isFullscreen ? 'text-xl' : 'text-lg'
          }`}>
            Weekly Capacity
          </h2>
          <div className="text-sm text-muted-foreground">
            <CountUpNumber end={person.totalHours} duration={1500} className="font-semibold text-foreground" />h
            <span className="mx-1">/</span>
            {person.capacity}h
          </div>
        </div>
        
        <Progress 
          value={Math.min(person.utilizationPercentage, 100)} 
          className="h-4 transition-all duration-1000 ease-out"
        />
      </div>

      {/* Projects */}
      <div className="px-8 mb-8 relative z-10">
        <h3 className={`font-semibold text-foreground mb-5 flex items-center gap-2 ${
          isFullscreen ? 'text-xl' : 'text-lg'
        }`}>
          <span>Project Allocations</span>
          <Badge variant="secondary" className="text-xs">{person.projects.length}</Badge>
        </h3>
        
        <div className="space-y-3">
          {person.projects.map((project) => (
            <EditableProjectAllocation
              key={`${project.id}-${refreshKey}`}
              memberId={person.id}
              projectId={project.id}
              projectName={project.name}
              projectCode={project.code}
              hours={project.hours}
              percentage={project.percentage}
              color={project.color}
              weekStartDate={weekStartDate}
              capacity={person.capacity}
              onUpdate={handleDataChange}
            />
          ))}
          
          <AddProjectAllocation
            memberId={person.id}
            weekStartDate={weekStartDate}
            existingProjectIds={person.projects.map(p => p.id)}
            onAdd={handleDataChange}
          />
        </div>
      </div>

      {/* Leave Information */}
      {totalLeaveHours > 0 && (
        <div className="mx-8 mb-6 glass rounded-xl p-5 relative z-10 border border-primary/10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Leave This Week</h4>
            <Badge variant="outline" className="ml-auto"><CountUpNumber end={totalLeaveHours} duration={1000} />h total</Badge>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {person.leave?.annualLeave > 0 && (
              <div className="text-center bg-background/40 rounded-lg p-3 border border-border/30">
                <div className={`font-bold text-foreground mb-1 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
                  <CountUpNumber end={person.leave.annualLeave} duration={1000} />h
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Annual</div>
              </div>
            )}
            {person.leave?.vacationLeave > 0 && (
              <div className="text-center bg-background/40 rounded-lg p-3 border border-border/30">
                <div className={`font-bold text-foreground mb-1 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
                  <CountUpNumber end={person.leave.vacationLeave} duration={1000} />h
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Vacation</div>
              </div>
            )}
            {person.leave?.medicalLeave > 0 && (
              <div className="text-center bg-background/40 rounded-lg p-3 border border-border/30">
                <div className={`font-bold text-foreground mb-1 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
                  <CountUpNumber end={person.leave.medicalLeave} duration={1000} />h
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Medical</div>
              </div>
            )}
            {person.leave?.publicHoliday > 0 && (
              <div className="text-center bg-background/40 rounded-lg p-3 border border-border/30">
                <div className={`font-bold text-foreground mb-1 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
                  <CountUpNumber end={person.leave.publicHoliday} duration={1000} />h
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Holiday</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};