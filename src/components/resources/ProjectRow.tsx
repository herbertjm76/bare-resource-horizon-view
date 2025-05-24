
import React from 'react';
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/dialogs/AddResourceDialog';
import { useStageColorMap } from '@/components/projects/hooks/useProjectColors';
import { ProjectHeader } from './components/ProjectHeader';
import { AddResourceRow } from './components/AddResourceRow';
import { useWeekMilestones } from './hooks/useWeekMilestones';
import { useProjectResources } from './hooks/useProjectResources';
import { useWeeklyProjectHours } from './hooks/useWeeklyProjectHours';
import { format } from 'date-fns';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean; // Added for week separators
}

interface ProjectRowProps {
  project: any;
  days: DayInfo[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  isEven?: boolean;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  days,
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
  
  // Helper to get day key for allocation lookup
  const getDayKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Sum up all resource hours for each day
  const dailyProjectHours: Record<string, number> = {};
  days.forEach(day => {
    const dayKey = getDayKey(day.date);
    dailyProjectHours[dayKey] = 0;
    
    // Sum up hours for this day across all resources
    resources.forEach(resource => {
      const allocationKey = `${resource.id}:${dayKey}`;
      const hours = projectAllocations[allocationKey] || 0;
      dailyProjectHours[dayKey] += hours;
    });
  });
  
  // Calculate total project hours
  const totalProjectHours = Object.values(dailyProjectHours).reduce((sum, hours) => sum + hours, 0);
  
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
      <tr className={`border-t border-b border-gray-200 ${headerBgClass} h-8`}>
        <ProjectHeader
          project={project}
          resourceCount={0}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          headerBgClass={headerBgClass}
        />
        
        {days.map((day) => (
          <td key={getDayKey(day.date)} className="p-0 text-center">
            <div className="h-full flex items-center justify-center">-</div>
          </td>
        ))}
        
        {/* Add blank flexible cell */}
        <td className="p-0"></td>
      </tr>
    );
  }

  return (
    <>
      <tr className={`border-t border-b border-gray-200 ${headerBgClass} h-10`}>
        <ProjectHeader
          project={project}
          resourceCount={resources.length}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          headerBgClass={headerBgClass}
          totalHours={totalProjectHours}
        />
        
        {/* Day allocation cells - always show project totals */}
        {days.map((day) => {
          const dayKey = getDayKey(day.date);
          const projectHours = dailyProjectHours[dayKey] || 0;
          
          // Style classes
          const isWeekendClass = day.isWeekend ? 'bg-muted/40' : '';
          const isSundayClass = day.isSunday ? 'sunday-border' : '';
          const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
          const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';
          const hasHoursClass = projectHours > 0 ? 'font-medium' : 'text-muted-foreground';
          
          return (
            <td 
              key={dayKey} 
              className={`p-0 text-center w-[30px] ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass}`}
            >
              <div className="px-0.5 py-1 text-xs">
                {projectHours > 0 ? (
                  <span className="bg-white/80 rounded-full px-1.5 py-0.5 font-medium text-xs inline-block min-w-[22px]">
                    {projectHours}
                  </span>
                ) : (
                  <span className="text-muted-foreground"></span>
                )}
              </div>
            </td>
          );
        })}
        
        {/* Add blank flexible cell */}
        <td className="p-0"></td>
      </tr>
      
      {/* Resource rows when project is expanded */}
      {isExpanded && resources.map(resource => (
        <ResourceRow 
          key={resource.id} 
          resource={resource}
          days={days}
          projectId={project.id} 
          onAllocationChange={handleAllocationChange} 
          onDeleteResource={handleDeleteResource}
          isEven={isEven}
        />
      ))}
      
      {/* Add resource row when project is expanded */}
      <AddResourceRow
        isExpanded={isExpanded}
        rowBgClass={rowBgClass}
        daysCount={days.length}
        onAddResource={() => setShowAddResource(true)}
      />
      
      {showAddResource && (
        <AddResourceDialog 
          projectId={project.id} 
          onClose={() => setShowAddResource(false)} 
          onAdd={handleAddResource} 
        />
      )}
    </>
  );
};
