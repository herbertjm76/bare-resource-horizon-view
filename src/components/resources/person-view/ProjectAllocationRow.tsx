import React from 'react';
import { DayInfo } from '../grid/types';
import { PersonProject, PersonResourceData } from '@/hooks/usePersonResourceData';

interface ProjectAllocationRowProps {
  project: PersonProject;
  person: PersonResourceData;
  days: DayInfo[];
  isEven: boolean;
  projectIndex: number;
}

export const ProjectAllocationRow: React.FC<ProjectAllocationRowProps> = ({
  project,
  person,
  days,
  isEven,
  projectIndex
}) => {
  const rowBgColor = isEven ? '#f9fafb' : '#ffffff';

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
        const hours = project.allocations[dayKey] || 0;
        
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '24px'
            }}>
              {hours > 0 ? (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {hours}
                </span>
              ) : (
                <span style={{ 
                  color: 'rgba(0, 0, 0, 0.2)',
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
  );
};
