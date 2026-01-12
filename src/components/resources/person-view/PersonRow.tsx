import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toUTCDateKey } from '@/utils/dateKey';
import { ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectAllocationRow } from './ProjectAllocationRow';
import { AddProjectRow } from './AddProjectRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import { PersonResourceData } from '@/hooks/usePersonResourceData';
import { ResourceAllocationDialog } from '../dialogs/ResourceAllocationDialog';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { calculateUtilizationPercentage } from '@/components/week-resourcing/utils/utilizationCalculations';
import { getUtilizationBgColor, getUtilizationTextColor } from '@/utils/utilizationColors';

interface PersonRowProps {
  person: PersonResourceData;
  weeks: WeekInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
  selectedDate?: Date;
  periodToShow?: number;
  onRefresh: () => void;
}

export const PersonRow: React.FC<PersonRowProps> = React.memo(({
  person,
  weeks,
  isExpanded,
  onToggleExpand,
  isEven,
  selectedDate,
  periodToShow,
  onRefresh
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = getMemberCapacity(person.weeklyCapacity, workWeekHours);
  const [projectAllocations, setProjectAllocations] = useState(person.projects);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get week start date from the first week in weeks array
  const weekStartDate = weeks.length > 0 ? weeks[0].weekStartDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  useEffect(() => {
    setProjectAllocations(person.projects);
  }, [person.projects]);

  const getInitials = () => {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  };

  const handleLocalAllocationChange = (projectId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev =>
      prev.map(project =>
        project.projectId === projectId
          ? {
              ...project,
              allocations: {
                ...project.allocations,
                [weekKey]: hours
              }
            }
          : project
      )
    );
  };

  return (
    <>
      <ResourceAllocationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={{
          id: person.personId,
          firstName: person.firstName,
          lastName: person.lastName,
          avatarUrl: person.avatarUrl,
          type: person.resourceType,
        }}
        weekStartDate={weekStartDate}
        compact={false}
      />
      {/* Person Header Row */}
      <tr className="workload-resource-row project-header-row">
        {/* Person info column - Fixed width, sticky */}
        <td 
          className="workload-resource-cell project-resource-column cursor-pointer hover:bg-muted/50"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0',
            zIndex: 20,
            textAlign: 'left',
            padding: '12px 16px',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
            verticalAlign: 'middle'
          }}
          onClick={() => setDialogOpen(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="ghost"
              size="sm"
              style={{ 
                width: '24px', 
                height: '24px', 
                padding: '0',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'black',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 30,
                pointerEvents: 'auto'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? (
                <ChevronDown style={{ width: '12px', height: '12px', color: 'black', pointerEvents: 'none' }} />
              ) : (
                <ChevronRight style={{ width: '12px', height: '12px', color: 'black', pointerEvents: 'none' }} />
              )}
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage src={person.avatarUrl} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div style={{ flex: '1', minWidth: '0' }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                color: 'black',
                margin: '0',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {person.firstName} {person.lastName}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '4px'
              }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontSize: '12px',
                  color: 'black'
                }}>
                  <Briefcase style={{ width: '12px', height: '12px', color: 'black' }} />
                  {person.projects.length} projects
                </span>
              </div>
            </div>
          </div>
        </td>
        
        {/* Week allocation cells - show total hours for person across all projects */}
        {weeks.map((week) => {
          const weekKey = toUTCDateKey(week.weekStartDate);
          
          // Calculate week total from all projects for this person (using local state)
          const weekTotal = projectAllocations.reduce((total, project) => {
            const hours = project.allocations[weekKey] || 0;
            return total + hours;
          }, 0);
          
          // Calculate utilization percentage for color coding
          const utilizationPercentage = calculateUtilizationPercentage(weekTotal, capacity);
          
          
          return (
            <td 
              key={weekKey} 
              className="workload-resource-cell week-column"
              style={{ 
                width: '80px', 
                minWidth: '80px',
                maxWidth: '80px',
                textAlign: 'center',
                padding: '4px',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
                verticalAlign: 'middle',
                backgroundColor: week.isPreviousWeek ? 'rgba(0, 0, 0, 0.03)' : getUtilizationBgColor(utilizationPercentage),
                ...(week.isPreviousWeek && {
                  opacity: 0.5
                })
              }}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '24px'
              }}>
                {weekTotal > 0 ? (
                  <span 
                    style={{ 
                      fontSize: '13px',
                      fontWeight: '600',
                      color: getUtilizationTextColor(utilizationPercentage)
                    }}
                  >
                    {formatAllocationValue(weekTotal, capacity, displayPreference)}
                  </span>
                ) : (
                  <span style={{ 
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: '13px'
                  }}>
                    —
                  </span>
                )}
              </div>
            </td>
          );
        })}
      </tr>
      
      {/* Project Rows (when expanded) */}
      {isExpanded && projectAllocations.map((project, projectIndex) => (
        <ProjectAllocationRow
          key={project.projectId}
          project={project}
          person={person}
          weeks={weeks}
          isEven={isEven}
          projectIndex={projectIndex}
          selectedDate={selectedDate}
          periodToShow={periodToShow}
          onLocalAllocationChange={handleLocalAllocationChange}
          initialAllocations={project.allocations}
          onProjectRemoved={onRefresh}
        />
      ))}
      
      {/* Add Project Row */}
      {isExpanded && (
        <AddProjectRow
          personId={person.personId}
          resourceType={person.resourceType}
          existingProjectIds={projectAllocations.map(p => p.projectId)}
          weeks={weeks}
          onProjectAdded={onRefresh}
        />
      )}
    </>
  );
}, (prevProps, nextProps) => {
  const prevProjectIds = prevProps.person.projects.map((p) => p.projectId).join(',');
  const nextProjectIds = nextProps.person.projects.map((p) => p.projectId).join(',');

  return (
    prevProps.person.personId === nextProps.person.personId &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isEven === nextProps.isEven &&
    prevProps.weeks.length === nextProps.weeks.length &&
    prevProjectIds === nextProjectIds
  );
});
