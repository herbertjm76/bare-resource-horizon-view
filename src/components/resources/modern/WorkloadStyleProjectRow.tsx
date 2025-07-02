
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
  const { resources, isLoading } = useProjectResources(project.id);
  
  const rowBgColor = isEven ? 'white' : '#f9fafb';
  
  return (
    <>
      {/* Project Header Row */}
      <tr className="workload-grid-row" style={{ backgroundColor: rowBgColor }}>
        {/* Control column - Fixed width, sticky */}
        <td 
          className="workload-grid-cell"
          style={{
            width: '60px',
            minWidth: '60px',
            maxWidth: '60px',
            position: 'sticky',
            left: '0px',
            zIndex: 20,
            backgroundColor: rowBgColor,
            boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)'
          }}
        >
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 border border-gray-300 hover:bg-gray-100"
              onClick={onToggleExpand}
              disabled={isLoading}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </td>
        
        {/* Project info column - Fixed width, sticky */}
        <td 
          className="workload-grid-cell"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '60px',
            zIndex: 20,
            backgroundColor: rowBgColor,
            textAlign: 'left',
            padding: '12px 16px',
            boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)'
          }}
        >
          <div className="project-info">
            <div className="project-header">
              <h3 className="project-title text-sm font-medium text-gray-900 truncate">
                {project.name}
              </h3>
              <div className="project-meta flex items-center gap-2 mt-1">
                <span className="resource-count flex items-center gap-1 text-xs text-gray-600">
                  <Users className="h-3 w-3" />
                  {resources.length} resources
                </span>
                {project.project_code && (
                  <span className="project-code bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                    {project.project_code}
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        
        {/* Day allocation cells */}
        {days.map((day) => {
          const dayKey = day.date.toISOString().split('T')[0];
          const dayTotal = 0; // Calculate from actual data
          
          let cellBgColor = rowBgColor;
          if (day.isWeekend) cellBgColor = day.isWeekend ? '#f3f4f6' : rowBgColor;
          
          return (
            <td 
              key={dayKey} 
              className="workload-grid-cell"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                backgroundColor: cellBgColor,
                textAlign: 'center',
                padding: '4px 2px'
              }}
            >
              <div className="allocation-summary">
                {dayTotal > 0 ? (
                  <span className="total-hours text-xs font-semibold bg-gray-800 text-white px-2 py-1 rounded">
                    {dayTotal}h
                  </span>
                ) : (
                  <span className="no-allocation text-gray-400 text-xs">—</span>
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
