
import React from 'react';
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/dialogs/AddResourceDialog';
import { ProjectHeader } from './components/ProjectHeader';
import { AddResourceRow } from './components/AddResourceRow';
import { DailyAllocationCell } from './components/DailyAllocationCell';
import { useProjectRowData } from './hooks/useProjectRowData';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
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
    showAddResource,
    isLoading,
    isLoadingAllocations,
    dailyProjectHours,
    totalProjectHours,
    getDayKey,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    checkResourceInOtherProjects
  } = useProjectRowData(project, days);
  
  console.log('ProjectRow render:', {
    projectId: project.id,
    projectName: project.name,
    isExpanded,
    resourcesCount: resources.length,
    isLoading,
    isLoadingAllocations
  });
  
  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white hover:bg-gray-50" 
    : "bg-gray-50 hover:bg-gray-100";
  
  // Header row background
  const headerBgClass = isEven 
    ? "bg-brand-violet-light/70 hover:bg-brand-violet-light" 
    : "bg-brand-violet-light hover:bg-brand-violet-light/90";

  const handleToggleExpand = () => {
    console.log('ProjectRow: handleToggleExpand called for project:', project.id);
    console.log('ProjectRow: Current isExpanded state:', isExpanded);
    console.log('ProjectRow: About to call onToggleExpand');
    onToggleExpand();
  };

  if ((isLoading || isLoadingAllocations) && isExpanded) {
    return (
      <tr className={`border-t border-b border-gray-200 ${headerBgClass} h-8`}>
        <ProjectHeader
          project={project}
          resourceCount={0}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpand}
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
          onToggleExpand={handleToggleExpand}
          headerBgClass={headerBgClass}
          totalHours={totalProjectHours}
        />
        
        {/* Day allocation cells - always show project totals */}
        {days.map((day) => {
          const dayKey = getDayKey(day.date);
          const projectHours = dailyProjectHours[dayKey] || 0;
          
          return (
            <DailyAllocationCell
              key={dayKey}
              day={day}
              dayKey={dayKey}
              projectHours={projectHours}
            />
          );
        })}
        
        {/* Add blank flexible cell */}
        <td className="p-0"></td>
      </tr>
      
      {/* Resource rows when project is expanded */}
      {isExpanded && resources.map(resource => {
        console.log('Rendering resource row for expanded project:', resource.id, resource.name);
        return (
          <ResourceRow 
            key={resource.id} 
            resource={resource}
            days={days}
            projectId={project.id} 
            onAllocationChange={handleAllocationChange} 
            onDeleteResource={handleDeleteResource}
            onCheckOtherProjects={checkResourceInOtherProjects}
            isEven={isEven}
          />
        );
      })}
      
      {/* Add resource row when project is expanded */}
      {isExpanded && (
        <AddResourceRow
          isExpanded={isExpanded}
          rowBgClass={rowBgClass}
          daysCount={days.length}
          onAddResource={() => setShowAddResource(true)}
        />
      )}
      
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
