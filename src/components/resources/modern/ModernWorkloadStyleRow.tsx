
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { ModernWorkloadStyleResourceRow } from './ModernWorkloadStyleResourceRow';
import { useProjectResources } from '../hooks/useProjectResources';
import { DayInfo } from '../grid/types';

interface ModernWorkloadStyleRowProps {
  project: any;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
}

export const ModernWorkloadStyleRow: React.FC<ModernWorkloadStyleRowProps> = ({
  project,
  days,
  isExpanded,
  onToggleExpand,
  isEven
}) => {
  const { resources, isLoading } = useProjectResources(project.id);
  
  const rowClass = `workload-grid-row ${isEven ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`;
  
  return (
    <>
      {/* Project Header Row */}
      <tr className={rowClass}>
        {/* Project info column - Fixed width, sticky */}
        <td 
          className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0px',
            zIndex: 20,
            backgroundColor: isEven ? 'white' : '#f9fafb'
          }}
        >
          <div className="flex items-center gap-3 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="expand-button w-8 h-8 p-0 border border-gray-300 hover:bg-gray-100"
              onClick={onToggleExpand}
              disabled={isLoading}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
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
          </div>
        </td>
        
        {/* Day allocation cells */}
        {days.map((day) => {
          const dayKey = day.date.toISOString().split('T')[0];
          // Calculate project total for this day (sum of all resource allocations)
          const dayTotal = 0; // This will be calculated from actual data
          
          let cellClass = 'workload-grid-cell week-cell text-center';
          if (day.isWeekend) cellClass += ' bg-gray-100';
          
          return (
            <td 
              key={dayKey} 
              className={cellClass}
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px'
              }}
            >
              <div className="allocation-summary p-1">
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
        <ModernWorkloadStyleResourceRow
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
