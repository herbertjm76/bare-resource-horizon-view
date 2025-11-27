
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { WorkloadStyleResourceRow } from './WorkloadStyleResourceRow';
import { AddResourceRow } from '../components/AddResourceRow';
import { AddResourceDialog } from '../dialogs/AddResourceDialog';
import { useProjectResources } from '../hooks/useProjectResources';
import { DayInfo } from '../grid/types';

interface WorkloadStyleProjectRowProps {
  project: any;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
  selectedDate?: Date;
  periodToShow?: number;
}

export const WorkloadStyleProjectRow: React.FC<WorkloadStyleProjectRowProps> = React.memo(({
  project,
  days,
  isExpanded,
  onToggleExpand,
  isEven,
  selectedDate,
  periodToShow
}) => {
  const { 
    resources, 
    isLoading, 
    projectAllocations, 
    getAllocationKey, 
    handleAllocationChange,
    handleAddResource,
    refreshResources 
  } = useProjectResources(project.id);
  
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false);
  
  const rowBgColor = isEven ? '#ffffff' : '#f9fafb';
  
  // Calculate total FTE across all resources for visible days
  const totalFTE = React.useMemo(() => {
    const totalHours = resources.reduce((total, resource) => {
      const resourceHours = days.reduce((sum, day) => {
        const dayKey = day.date.toISOString().split('T')[0];
        const allocationKey = getAllocationKey(resource.id, dayKey);
        const hours = projectAllocations[allocationKey] || 0;
        return sum + hours;
      }, 0);
      return total + resourceHours;
    }, 0);
    
    // Calculate number of weeks in the period
    const numberOfWeeks = days.length / 7;
    // Calculate average hours per week
    const averageWeeklyHours = numberOfWeeks > 0 ? totalHours / numberOfWeeks : 0;
    // Convert to FTE (40 hours = 1 FTE)
    return averageWeeklyHours / 40;
  }, [resources, days, projectAllocations, getAllocationKey]);
  
  return (
    <>
      {/* Project Header Row */}
      <tr className="workload-resource-row project-header-row">
        {/* Project info column - Fixed width, sticky */}
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
              disabled={isLoading}
            >
              {isExpanded ? (
                <ChevronDown style={{ width: '12px', height: '12px', color: 'black', pointerEvents: 'none' }} />
              ) : (
                <ChevronRight style={{ width: '12px', height: '12px', color: 'black', pointerEvents: 'none' }} />
              )}
            </Button>
            
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
                {project.name}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '4px'
              }}>
                <Badge 
                  variant="secondary"
                  className="gap-1 font-medium"
                >
                  <Users className="w-3 h-3" />
                  {totalFTE.toFixed(1)} FTE
                </Badge>
                {project.code && (
                  <span style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'black',
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
          
          let cellBgColor = 'transparent'; // Let CSS gradient show through
          
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
      
      {/* Resource Rows (when expanded) */}
      {isExpanded && resources.map((resource, resourceIndex) => (
        <WorkloadStyleResourceRow
          key={resource.id}
          resource={resource}
          project={project}
          days={days}
          isEven={isEven}
          resourceIndex={resourceIndex}
          selectedDate={selectedDate}
          periodToShow={periodToShow}
          onAllocationChange={handleAllocationChange}
        />
      ))}

      {/* Add Resource Row (when expanded) */}
      {isExpanded && (
        <AddResourceRow
          isExpanded={true}
          rowBgClass="add-resource-row"
          daysCount={days.length}
          onAddResource={() => setShowAddResourceDialog(true)}
        />
      )}

      {/* Add Resource Dialog */}
      {showAddResourceDialog && (
        <AddResourceDialog
          projectId={project.id}
          onClose={() => setShowAddResourceDialog(false)}
          onAdd={async (resource) => {
            await handleAddResource(resource);
            await refreshResources();
            setShowAddResourceDialog(false);
          }}
        />
      )}
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isEven === nextProps.isEven &&
    prevProps.days.length === nextProps.days.length
  );
});
