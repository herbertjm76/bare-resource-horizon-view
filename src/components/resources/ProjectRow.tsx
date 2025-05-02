
import React from 'react';
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/dialogs/AddResourceDialog';
import { useStageColorMap } from '@/components/projects/hooks/useProjectColors';
import { ProjectHeader } from './components/ProjectHeader';
import { WeekAllocationCell } from './components/WeekAllocationCell';
import { AddResourceRow } from './components/AddResourceRow';
import { useWeekMilestones } from './hooks/useWeekMilestones';
import { useProjectResources } from './hooks/useProjectResources';
import { useWeeklyProjectHours } from './hooks/useWeeklyProjectHours';
import { getWeekKey } from './utils/milestoneUtils';
import { ProjectTotalsRow } from './components/ProjectTotalsRow';

interface ProjectRowProps {
  project: any;
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven?: boolean;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  weeks,
  isExpanded,
  onToggleExpand,
  isEven = false
}) => {
  const {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    isLoadingAllocations,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    getAllocationKey
  } = useProjectResources(project.id);

  const { 
    weekMilestones, 
    setWeekMilestone, 
    hasContinuousStage 
  } = useWeekMilestones();
  
  // Get stage colors from the project if available
  const stageColorMap = useStageColorMap(project?.officeStages || []);
  
  // Sum up all resource hours for each week
  const weeklyProjectHours = useWeeklyProjectHours(projectAllocations, weeks);
  
  // Calculate total project hours
  const totalProjectHours = Object.values(weeklyProjectHours).reduce((sum, hours) => sum + hours, 0);
  
  // For debugging
  React.useEffect(() => {
    console.log("Project ID:", project.id);
    console.log("Project allocations:", projectAllocations);
    console.log("Weekly project hours:", weeklyProjectHours);
    console.log("Total project hours:", totalProjectHours);
  }, [projectAllocations, weeklyProjectHours, totalProjectHours, project.id]);

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white hover:bg-gray-50" 
    : "bg-gray-50 hover:bg-gray-100";
  
  // Header row background
  const headerBgClass = isEven 
    ? "bg-brand-violet-light/70 hover:bg-brand-violet-light" 
    : "bg-brand-violet-light hover:bg-brand-violet-light/90";

  if ((isLoading || isLoadingAllocations) && isExpanded) {
    return (
      <tr className={`border-t border-b border-gray-200 ${headerBgClass}`}>
        <ProjectHeader
          project={project}
          resourceCount={0}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          headerBgClass={headerBgClass}
        />
        
        {weeks.map((week) => (
          <td key={getWeekKey(week.startDate)} className="p-0 text-center">
            <div className="h-full flex items-center justify-center">-</div>
          </td>
        ))}
      </tr>
    );
  }

  return <>
      <tr className={`border-t border-b border-gray-200 ${headerBgClass}`}>
        <ProjectHeader
          project={project}
          resourceCount={resources.length}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          headerBgClass={headerBgClass}
          totalHours={totalProjectHours} // Pass the total hours to the header
        />
        
        {/* Week allocation cells - always show project totals */}
        {weeks.map((week, weekIndex) => {
          const weekKey = getWeekKey(week.startDate);
          const projectHours = weeklyProjectHours[weekKey] || 0;
          const milestone = weekMilestones[weekKey];
          const continuity = milestone?.stage 
            ? hasContinuousStage(weekIndex, milestone, weeks, getWeekKey) 
            : false;
          
          return (
            <WeekAllocationCell
              key={weekKey}
              weekKey={weekKey}
              weekLabel={week.label}
              projectHours={projectHours}
              milestone={milestone}
              continuity={continuity}
              stageColorMap={stageColorMap}
              setWeekMilestone={setWeekMilestone}
              projectStages={project.officeStages || []}
            />
          );
        })}
      </tr>
      
      {/* Resource rows when project is expanded */}
      {isExpanded && resources.map(resource => (
        <ResourceRow 
          key={resource.id} 
          resource={resource} 
          weeks={weeks} 
          projectId={project.id} 
          onAllocationChange={handleAllocationChange} 
          onDeleteResource={handleDeleteResource}
          isEven={isEven}
        />
      ))}
      
      {/* Only show project totals in a separate row if resources exist and the project is expanded */}
      {isExpanded && resources.length > 0 && false && ( // We've disabled this by setting condition to false
        <ProjectTotalsRow
          weeklyProjectHours={weeklyProjectHours}
          weeks={weeks}
          isEven={isEven}
        />
      )}
      
      {/* Add resource row when project is expanded */}
      <AddResourceRow
        isExpanded={isExpanded}
        rowBgClass={rowBgClass}
        weeksCount={weeks.length}
        onAddResource={() => setShowAddResource(true)}
      />
      
      {showAddResource && (
        <AddResourceDialog 
          projectId={project.id} 
          onClose={() => setShowAddResource(false)} 
          onAdd={handleAddResource} 
        />
      )}
    </>;
};
