
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { WorkloadStyleResourceRow } from './WorkloadStyleResourceRow';
import { useProjectResources } from '../hooks/useProjectResources';
import { DayInfo } from '../grid/types';

interface WorkloadStyleProjectRowProps {
  project: any;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
}

export const WorkloadStyleProjectRow: React.FC<WorkloadStyleProjectRowProps> = ({
  project,
  days,
  isExpanded,
  onToggleExpand,
  isEven
}) => {
  const { resources, isLoading, projectAllocations, getAllocationKey } = useProjectResources(project.id);
  
  const rowBgColor = isEven ? '#ffffff' : '#f9fafb';
  
  return (
    <>
      {/* Project Header Row */}
      <tr className="workload-resource-row project-header-row">
        {/* Project info column - Fixed width, sticky */}
        <td 
          className="workload-resource-cell project-resource-column"
          style={{
            backgroundColor: rowBgColor,
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
                border: '1px solid #d1d5db',
                backgroundColor: 'white'
              }}
              onClick={onToggleExpand}
              disabled={isLoading}
            >
              {isExpanded ? (
                <ChevronDown style={{ width: '12px', height: '12px' }} />
              ) : (
                <ChevronRight style={{ width: '12px', height: '12px' }} />
              )}
            </Button>
            
            <div style={{ flex: '1', minWidth: '0' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827',
                margin: '0',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {project.name}
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
                  color: '#6b7280'
                }}>
                  <Users style={{ width: '12px', height: '12px' }} />
                  {resources.length} resources
                </span>
                {project.code && (
                  <span style={{ 
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {project.code}
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        
        {/* Day allocation cells */}
        {days.map((day) => {
          const dayKey = day.date.toISOString().split('T')[0];
          
          // Calculate day total from all resources for this project
          const dayTotal = resources.reduce((total, resource) => {
            const allocationKey = getAllocationKey(resource.id, dayKey);
            const hours = projectAllocations[allocationKey] || 0;
            return total + hours;
          }, 0);
          
          let cellBgColor = rowBgColor;
          if (day.isWeekend) cellBgColor = '#f3f4f6';
          
          return (
            <td 
              key={dayKey} 
              className="workload-resource-cell day-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                backgroundColor: cellBgColor,
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
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {dayTotal}h
                  </span>
                ) : (
                  <span style={{ 
                    color: '#9ca3af',
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
      
      {/* Resource Rows (when expanded) */}
      {isExpanded && resources.map((resource, resourceIndex) => (
        <WorkloadStyleResourceRow
          key={resource.id}
          resource={resource}
          project={project}
          days={days}
          isEven={isEven}
          resourceIndex={resourceIndex}
        />
      ))}
    </>
  );
};
