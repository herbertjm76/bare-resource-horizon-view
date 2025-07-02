
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { ModernResourceRow } from './ModernResourceRow';
import { useProjectResources } from '../hooks/useProjectResources';
import { DayInfo } from '../grid/types';

interface ModernProjectRowProps {
  project: any;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
}

export const ModernProjectRow: React.FC<ModernProjectRowProps> = ({
  project,
  days,
  isExpanded,
  onToggleExpand,
  isEven
}) => {
  const { resources, isLoading } = useProjectResources(project.id);
  
  const rowClass = `modern-project-row ${isEven ? 'even' : 'odd'}`;
  
  return (
    <>
      {/* Project Header Row */}
      <tr className={rowClass}>
        {/* Control column - matching workload exactly */}
        <td 
          className="modern-cell control-cell"
          style={{
            width: '60px',
            minWidth: '60px',
            maxWidth: '60px',
            backgroundColor: isEven ? '#f9fafb' : 'white'
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="expand-button"
            onClick={onToggleExpand}
            disabled={isLoading}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </td>
        
        {/* Project info column - matching workload exactly */}
        <td 
          className="modern-cell project-cell"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            backgroundColor: isEven ? '#f9fafb' : 'white'
          }}
        >
          <div className="project-info">
            <div className="project-header">
              <h3 className="project-title">{project.name}</h3>
              <div className="project-meta">
                <span className="resource-count">
                  <Users className="h-3 w-3" />
                  {resources.length} resources
                </span>
                {project.project_code && (
                  <span className="project-code">{project.project_code}</span>
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
          
          let cellClass = 'modern-cell day-cell project-summary';
          if (day.isWeekend) cellClass += ' weekend';
          if (day.isSunday) cellClass += ' sunday';
          
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
              <div className="allocation-summary">
                {dayTotal > 0 ? (
                  <span className="total-hours">{dayTotal}h</span>
                ) : (
                  <span className="no-allocation">—</span>
                )}
              </div>
            </td>
          );
        })}
      </tr>
      
      {/* Resource Rows (when expanded) */}
      {isExpanded && resources.map((resource) => (
        <ModernResourceRow
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
