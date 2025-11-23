import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectAllocationRow } from './ProjectAllocationRow';
import { DayInfo } from '../grid/types';
import { PersonResourceData } from '@/hooks/usePersonResourceData';

interface PersonRowProps {
  person: PersonResourceData;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
  selectedDate?: Date;
  periodToShow?: number;
  onDataChange?: () => void;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  person,
  days,
  isExpanded,
  onToggleExpand,
  isEven,
  selectedDate,
  periodToShow,
  onDataChange
}) => {
  const getInitials = () => {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      {/* Person Header Row */}
      <tr className="workload-resource-row project-header-row">
        {/* Person info column - Fixed width, sticky */}
        <td 
          className="workload-resource-cell project-resource-column"
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
                color: 'black'
              }}
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <ChevronDown style={{ width: '12px', height: '12px', color: 'black' }} />
              ) : (
                <ChevronRight style={{ width: '12px', height: '12px', color: 'black' }} />
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
                {person.location && (
                  <span style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'black',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {person.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        
        {/* Day allocation cells - show total hours for person across all projects */}
        {days.map((day) => {
          const dayKey = day.date.toISOString().split('T')[0];
          
          // Calculate day total from all projects for this person
          const dayTotal = person.projects.reduce((total, project) => {
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
                verticalAlign: 'middle'
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
      {isExpanded && person.projects.map((project, projectIndex) => (
        <ProjectAllocationRow
          key={project.projectId}
          project={project}
          person={person}
          days={days}
          isEven={isEven}
          projectIndex={projectIndex}
          selectedDate={selectedDate}
          periodToShow={periodToShow}
          onDataChange={onDataChange}
        />
      ))}
    </>
  );
};
