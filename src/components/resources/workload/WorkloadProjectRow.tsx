
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { WorkloadResourceRow } from './WorkloadResourceRow';
import { useProjectResources } from '../hooks/useProjectResources';
import { DayInfo } from '../grid/types';

interface WorkloadProjectRowProps {
  project: any;
  days: DayInfo[];
  isEven: boolean;
}

export const WorkloadProjectRow: React.FC<WorkloadProjectRowProps> = ({
  project,
  days,
  isEven
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { resources, isLoading } = useProjectResources(project.id);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Project Header Row */}
      <tr 
        className={`workload-grid-row ${isEven ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
      >
        <td 
          className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px'
          }}
        >
          <div className="flex items-center space-x-3 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 flex-shrink-0"
              onClick={toggleExpand}
              disabled={isLoading}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {resources.length} resources
                </span>
                {project.project_code && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
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
          // Calculate project total for this day (sum of all resource allocations)
          const dayTotal = 0; // This will be calculated from actual data
          
          return (
            <td 
              key={dayKey} 
              className="workload-grid-cell text-center"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px'
              }}
            >
              <div className="flex items-center justify-center min-h-[24px]">
                {dayTotal > 0 ? (
                  <span className="text-xs font-semibold text-gray-700">
                    {dayTotal}h
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </div>
            </td>
          );
        })}
      </tr>
      
      {/* Resource Rows (when expanded) */}
      {isExpanded && resources.map((resource) => (
        <WorkloadResourceRow
          key={resource.id}
          resource={resource}
          project={project}
          days={days}
          isEven={isEven}
        />
      ))}
    </>
  );
};
