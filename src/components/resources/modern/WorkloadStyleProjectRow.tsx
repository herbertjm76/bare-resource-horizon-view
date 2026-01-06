
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { WorkloadStyleResourceRow } from './WorkloadStyleResourceRow';
import { AddResourceRow } from '../components/AddResourceRow';
import { AddResourceDialog } from '../dialogs/AddResourceDialog';
import { useProjectResources } from '../hooks/useProjectResources';
import { WeekInfo } from '../hooks/useGridWeeks';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface MemberFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

interface WorkloadStyleProjectRowProps {
  project: any;
  weeks: WeekInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven: boolean;
  selectedDate?: Date;
  periodToShow?: number;
  memberFilters?: MemberFilters;
}

export const WorkloadStyleProjectRow: React.FC<WorkloadStyleProjectRowProps> = React.memo(({
  project,
  weeks,
  isExpanded,
  onToggleExpand,
  isEven,
  selectedDate,
  periodToShow,
  memberFilters
}) => {
  const { projectDisplayPreference, workWeekHours } = useAppSettings();
  const { 
    resources, 
    isLoading, 
    projectAllocations, 
    getAllocationKey, 
    handleAllocationChange,
    handleAddResource,
    handleDeleteResource,
    checkResourceInOtherProjects,
    refreshResources 
  } = useProjectResources(project.id);
  
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false);
  
  const rowBgColor = isEven ? '#ffffff' : '#f9fafb';

  // Filter resources based on member filters
  const filteredResources = React.useMemo(() => {
    if (!memberFilters) return resources;
    
    return resources.filter(resource => {
      // Filter by practice area
      if (memberFilters.practiceArea && memberFilters.practiceArea !== 'all') {
        if (resource.practice_area !== memberFilters.practiceArea) return false;
      }
      
      // Filter by department
      if (memberFilters.department && memberFilters.department !== 'all') {
        if (resource.department !== memberFilters.department) return false;
      }
      
      // Filter by location
      if (memberFilters.location && memberFilters.location !== 'all') {
        if (resource.location !== memberFilters.location) return false;
      }
      
      // Filter by search term
      if (memberFilters.searchTerm) {
        const searchLower = memberFilters.searchTerm.toLowerCase();
        const fullName = `${resource.first_name || ''} ${resource.last_name || ''}`.toLowerCase();
        if (!fullName.includes(searchLower) && !resource.name.toLowerCase().includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [resources, memberFilters]);
  
  // Calculate total hours across filtered resources for visible weeks (excluding previous week)
  const totalHours = React.useMemo(() => {
    return filteredResources.reduce((total, resource) => {
      const resourceHours = weeks
        .filter(week => !week.isPreviousWeek) // Exclude previous week from calculation
        .reduce((sum, week) => {
          const weekKey = week.weekStartDate.toISOString().split('T')[0];
          const allocationKey = getAllocationKey(resource.id, weekKey);
          const hours = projectAllocations[allocationKey] || 0;
          return sum + hours;
        }, 0);
      return total + resourceHours;
    }, 0);
  }, [filteredResources, weeks, projectAllocations, getAllocationKey]);
  
  // Calculate FTE (workWeekHours = 1 FTE per week)
  const visibleWeeksCount = weeks.filter(w => !w.isPreviousWeek).length;
  const totalFTE = visibleWeeksCount > 0 ? totalHours / (workWeekHours * visibleWeeksCount) : 0;

  /**
   * CRITICAL: Member Filter Integration
   * ------------------------------------
   * This logic ensures that when member filters (practiceArea, department, location, searchTerm)
   * are active, projects with NO matching resources are hidden from the view.
   * 
   * DO NOT REMOVE OR MODIFY this without understanding the full filtering flow:
   * 1. MemberFilterRow sets filters in ResourceScheduling page state
   * 2. Filters are passed down through ProjectResourcingContent -> WorkloadStyleResourceGrid -> here
   * 3. filteredResources is already filtered by useFilteredResources hook
   * 4. If no resources match the active filters, this project row should not render
   * 
   * This was broken before and fixed - maintain this behavior!
   */
  const hasActiveMemberFilters = Boolean(
    memberFilters &&
    (memberFilters.practiceArea !== 'all' ||
      memberFilters.department !== 'all' ||
      memberFilters.location !== 'all' ||
      (memberFilters.searchTerm && memberFilters.searchTerm.trim() !== ''))
  );

  // Hide project row when member filters are active but no team members match
  if (hasActiveMemberFilters && !isLoading && filteredResources.length === 0) {
    return null;
  }
  
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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 border border-border bg-muted hover:bg-muted/80 text-foreground cursor-pointer relative z-30"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              aria-label={isExpanded ? 'Collapse project' : 'Expand project'}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-foreground m-0 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                {getProjectDisplayName(project, projectDisplayPreference)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="default"
                  className="gap-1 font-medium fte-badge"
                  style={{
                    backgroundColor: 'hsl(var(--theme-primary))',
                    color: 'hsl(0 0% 100%)'
                  }}
                >
                  <Users className="w-3 h-3" />
                  {totalFTE.toFixed(1)} FTE
                </Badge>
                {getProjectSecondaryText(project, projectDisplayPreference) && (
                  <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[11px] font-medium project-code-badge">
                    {getProjectSecondaryText(project, projectDisplayPreference)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>
        
        {/* Week allocation cells */}
        {weeks.map((week) => {
          const weekKey = week.weekStartDate.toISOString().split('T')[0];
          
          // Calculate week total from all resources for this project
          const weekTotal = resources.reduce((total, resource) => {
            const allocationKey = getAllocationKey(resource.id, weekKey);
            const hours = projectAllocations[allocationKey] || 0;
            return total + hours;
          }, 0);
          
          return (
            <td 
              key={weekKey} 
              className="workload-resource-cell week-column"
              style={{ 
                width: '80px', 
                minWidth: '80px',
                maxWidth: '80px',
                textAlign: 'center',
                padding: '4px',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.6)',
                verticalAlign: 'middle',
                ...(week.isPreviousWeek && {
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
                {weekTotal > 0 ? (
                  <span className="project-total-hours" style={{ fontSize: '13px' }}>
                    {weekTotal}h
                  </span>
                ) : (
                  <span style={{ 
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: '13px'
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
      {isExpanded && filteredResources.map((resource, resourceIndex) => (
        <WorkloadStyleResourceRow
          key={resource.id}
          resource={resource}
          project={project}
          weeks={weeks}
          isEven={isEven}
          resourceIndex={resourceIndex}
          selectedDate={selectedDate}
          periodToShow={periodToShow}
          onAllocationChange={handleAllocationChange}
          onDeleteResource={async (resourceId, globalDelete) => {
            await handleDeleteResource(resourceId, globalDelete);
            await refreshResources();
          }}
          onCheckOtherProjects={checkResourceInOtherProjects}
          projectAllocations={projectAllocations}
          getAllocationKey={getAllocationKey}
        />
      ))}

      {/* Add Resource Row (when expanded) */}
      {isExpanded && (
        <AddResourceRow
          isExpanded={true}
          rowBgClass="add-resource-row"
          daysCount={weeks.length}
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
    prevProps.weeks.length === nextProps.weeks.length &&
    prevProps.memberFilters?.practiceArea === nextProps.memberFilters?.practiceArea &&
    prevProps.memberFilters?.department === nextProps.memberFilters?.department &&
    prevProps.memberFilters?.location === nextProps.memberFilters?.location &&
    prevProps.memberFilters?.searchTerm === nextProps.memberFilters?.searchTerm
  );
});
