import React from 'react';
import { DayInfo } from '../grid/types';
import { PersonProject, PersonResourceData } from '@/hooks/usePersonResourceData';
import { Input } from '@/components/ui/input';
import { useAllocationInput } from '../hooks/useAllocationInput';

interface ProjectAllocationRowProps {
  project: PersonProject;
  person: PersonResourceData;
  days: DayInfo[];
  isEven: boolean;
  projectIndex: number;
  selectedDate?: Date;
  periodToShow?: number;
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  project,
  person,
  days,
  isEven,
  projectIndex,
  selectedDate,
  periodToShow
}) => {
  const rowBgColor = isEven ? '#f9fafb' : '#ffffff';

  // Use the allocation input system
  const {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  } = useAllocationInput({
    projectId: project.projectId,
    resourceId: person.personId,
    resourceType: person.resourceType,
    selectedDate,
    periodToShow,
    onAllocationChange: (resourceId, dayKey, hours) => {
      console.log(`Person ${resourceId} allocation changed for project ${project.projectId} on ${dayKey}: ${hours}h`);
    }
  });

  return (
    <tr className="workload-resource-row resource-row">
      {/* Project info column - Fixed width, sticky */}
      <td 
        className="workload-resource-cell resource-name-column"
        style={{
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px',
          position: 'sticky',
          left: '0',
          zIndex: 10,
          backgroundColor: rowBgColor,
          textAlign: 'left',
          padding: '8px 16px 8px 48px',
          borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
          verticalAlign: 'middle'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#374151',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {project.projectName}
            </div>
            {project.projectCode && (
              <div style={{ 
                fontSize: '11px',
                color: '#6b7280',
                marginTop: '2px'
              }}>
                {project.projectCode}
              </div>
            )}
          </div>
        </div>
      </td>
      
      {/* Day allocation cells */}
      {days.map((day) => {
        const dayKey = day.date.toISOString().split('T')[0];
        const allocation = allocations[dayKey] || 0;
        
        return (
          <td 
            key={dayKey}
            className="workload-resource-cell resource-day-column"
            style={{
              width: '30px',
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: rowBgColor,
              textAlign: 'center',
              padding: '2px',
              borderRight: '1px solid rgba(229, 231, 235, 0.8)',
              borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
              verticalAlign: 'middle'
            }}
          >
            <Input
              type="number"
              min="0"
              max="24"
              value={inputValues[dayKey] || ''}
              onChange={(e) => handleInputChange(dayKey, e.target.value)}
              onBlur={(e) => handleInputBlur(dayKey, e.target.value)}
              className={`
                w-5 h-5 px-0 py-0 text-center border-0 
                focus:border focus:border-primary focus:ring-1 focus:ring-primary
                ${allocation > 0 ? 'bg-primary/10 text-primary font-medium' : 'bg-muted/50 text-muted-foreground'}
                ${isSaving ? 'opacity-50' : ''}
                ${day.isWeekend ? 'bg-muted/30' : ''}
              `}
              placeholder=""
              disabled={isLoading || isSaving}
              style={{
                fontSize: '10px',
                lineHeight: '1',
                minHeight: '20px',
                borderRadius: '2px',
                textAlign: 'center'
              }}
            />
          </td>
        );
      })}
    </tr>
  );
};
