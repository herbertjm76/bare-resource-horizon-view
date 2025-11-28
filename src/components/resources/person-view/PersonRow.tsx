import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectAllocationRow } from './ProjectAllocationRow';
import { WeekInfo } from '../hooks/useGridWeeks';
import { PersonResourceData } from '@/hooks/usePersonResourceData';
import { ResourceAllocationDialog } from '../dialogs/ResourceAllocationDialog';

interface PersonRowProps {
  person: PersonResourceData;
  weeks: WeekInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
  selectedDate?: Date;
  periodToShow?: number;
}

export const PersonRow: React.FC<PersonRowProps> = React.memo(({
  person,
  weeks,
  isExpanded,
  onToggleExpand,
  isEven,
  selectedDate,
  periodToShow
}) => {
  const [projectAllocations, setProjectAllocations] = useState(person.projects);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get week start date from the first day in days array
  const weekStartDate = days.length > 0 ? days[0].date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  useEffect(() => {
    setProjectAllocations(person.projects);
  }, [person.projects]);

  const getInitials = () => {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  };

  const handleLocalAllocationChange = (projectId: string, dayKey: string, hours: number) => {
    setProjectAllocations(prev =>
      prev.map(project =>
        project.projectId === projectId
          ? {
              ...project,
              allocations: {
                ...project.allocations,
                [dayKey]: hours
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
        
        {/* Day allocation cells - show total hours for person across all projects */}
        {days.map((day) => {
          const dayKey = day.date.toISOString().split('T')[0];
          
          // Calculate day total from all projects for this person (using local state)
          const dayTotal = projectAllocations.reduce((total, project) => {
            const hours = project.allocations[dayKey] || 0;
            return total + hours;
          }, 0);
          
          return (
            <td 
              key={dayKey} 
              className="workload-resource-cell day-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                textAlign: 'center',
                padding: '2px',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
                verticalAlign: 'middle',
                ...(day.isPreviousWeek && {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
                {dayTotal > 0 ? (
                  <span className="project-total-hours">
                    {dayTotal}
                  </span>
                ) : (
                  <span style={{ 
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: '12px'
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
          days={days}
          isEven={isEven}
          projectIndex={projectIndex}
          selectedDate={selectedDate}
          periodToShow={periodToShow}
          onLocalAllocationChange={handleLocalAllocationChange}
        />
      ))}
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.person.personId === nextProps.person.personId &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isEven === nextProps.isEven &&
    prevProps.days.length === nextProps.days.length
  );
});
