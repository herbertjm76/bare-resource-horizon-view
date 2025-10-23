import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { EditableProjectAllocation } from './EditableProjectAllocation';
import { AddProjectAllocation } from './AddProjectAllocation';
import { format, startOfWeek } from 'date-fns';

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
      relative rounded-3xl glass-card glass-hover p-8 shadow-2xl
      ${isActive ? 'ring-2 ring-primary/50 glass-elevated' : ''}
      ${isFullscreen ? 'min-h-[80vh]' : 'min-h-[500px]'}
      transition-all duration-500 ease-out
      before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      overflow-hidden
    `}>
      {/* Header */}
      <div className="flex items-start gap-6 mb-8 relative z-10">
        <Avatar className={`${isFullscreen ? 'h-24 w-24' : 'h-16 w-16'} ring-4 ring-white/20 shadow-xl`}>
          <AvatarImage src={person.avatar_url} />
          <AvatarFallback className="text-xl font-semibold bg-gradient-modern text-white backdrop-blur-sm">
            {person.first_name.charAt(0)}{person.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h1 className={`font-bold text-foreground mb-2 ${
            isFullscreen ? 'text-4xl' : 'text-3xl'
          }`}>
            {person.first_name} {person.last_name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {person.location}
            </Badge>
            
            <Badge 
              variant={status.color as any}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Utilization Summary */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold text-foreground ${
            isFullscreen ? 'text-2xl' : 'text-xl'
          }`}>
            Weekly Utilization
          </h2>
          <div className="text-right">
            <div className={`font-bold text-foreground ${
              isFullscreen ? 'text-3xl' : 'text-2xl'
            }`}>
              {person.utilizationPercentage.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">
              {person.totalHours}h of {person.capacity}h capacity
            </div>
          </div>
        </div>
        
        <Progress 
          value={Math.min(person.utilizationPercentage, 100)} 
          className="h-3"
        />
      </div>

      {/* Projects */}
      <div className="mb-8 relative z-10">
        <h3 className={`font-semibold text-foreground mb-4 ${
          isFullscreen ? 'text-xl' : 'text-lg'
        }`}>
          Project Allocations
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
        <div className="glass rounded-xl p-4 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-foreground">Leave This Week</h4>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            {person.leave?.annualLeave > 0 && (
              <div className="text-center">
                <div className="font-semibold">{person.leave.annualLeave}h</div>
                <div className="text-muted-foreground">Annual</div>
              </div>
            )}
            {person.leave?.vacationLeave > 0 && (
              <div className="text-center">
                <div className="font-semibold">{person.leave.vacationLeave}h</div>
                <div className="text-muted-foreground">Vacation</div>
              </div>
            )}
            {person.leave?.medicalLeave > 0 && (
              <div className="text-center">
                <div className="font-semibold">{person.leave.medicalLeave}h</div>
                <div className="text-muted-foreground">Medical</div>
              </div>
            )}
            {person.leave?.publicHoliday > 0 && (
              <div className="text-center">
                <div className="font-semibold">{person.leave.publicHoliday}h</div>
                <div className="text-muted-foreground">Holiday</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};