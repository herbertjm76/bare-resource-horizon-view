
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/AddResourceDialog';
import { toast } from 'sonner';
import { useStageColorMap } from '@/components/projects/hooks/useProjectColors';
import { ProjectHeaderRow } from './project/ProjectHeaderRow';
import { AddResourceRow } from './project/AddResourceRow';
import { useProjectMilestones } from './hooks/useProjectMilestones';
import { useProjectAllocations } from './hooks/useProjectAllocations';
import { MilestoneInfo } from './milestones/types';

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
  const [showAddResource, setShowAddResource] = useState(false);
  const [resources, setResources] = useState([{
    id: '1',
    name: 'John Smith',
    role: 'Designer',
    allocations: {}
  }, {
    id: '2',
    name: 'Sarah Jones',
    role: 'Developer',
    allocations: {}
  }]);
  
  // Get stage colors from the project if available
  const stageColorMap = useStageColorMap(project?.officeStages || []);
  
  // Initialize milestone and allocation hooks
  const { 
    weekMilestones, 
    setWeekMilestone, 
    getMilestoneColor, 
    hasContinuousStage,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    isDragging,
    dragItem,
    dragSourceWeek
  } = useProjectMilestones(stageColorMap);
  
  const { 
    projectAllocations, 
    weeklyProjectHours, 
    handleAllocationChange, 
    setProjectAllocations 
  } = useProjectAllocations(weeks);

  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    setProjectAllocations(prev => {
      const newAllocations = {
        ...prev
      };
      delete newAllocations[resourceId];
      return newAllocations;
    });
  };

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white hover:bg-gray-50" 
    : "bg-gray-50 hover:bg-gray-100";
  
  // Header row background
  const headerBgClass = isEven 
    ? "bg-brand-violet-light/70 hover:bg-brand-violet-light" 
    : "bg-brand-violet-light hover:bg-brand-violet-light/90";

  const hasContinuousStageAdapter = (weekIndex: number, currentMilestone: MilestoneInfo | undefined) => {
    return hasContinuousStage(weekIndex, currentMilestone, weeks);
  };

  return <>
      <ProjectHeaderRow 
        project={project}
        weeks={weeks}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        weeklyProjectHours={weeklyProjectHours}
        weekMilestones={weekMilestones}
        stageColorMap={stageColorMap}
        resourceCount={resources.length}
        hasContinuousStage={hasContinuousStageAdapter}
        setWeekMilestone={setWeekMilestone}
        getMilestoneColor={getMilestoneColor}
        headerBgClass={headerBgClass}
        handleDragStart={handleDragStart}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        isDragging={isDragging}
        dragItem={dragItem}
      />
      
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
      
      {/* Add resource row when project is expanded */}
      {isExpanded && (
        <AddResourceRow
          rowBgClass={rowBgClass}
          weeks={weeks}
          onAddResource={() => setShowAddResource(true)}
        />
      )}
      
      {showAddResource && (
        <AddResourceDialog 
          projectId={project.id} 
          onClose={() => setShowAddResource(false)} 
          onAdd={resource => {
            const newResource = {
              id: resource.staffId,
              name: resource.name,
              role: resource.role || 'Team Member',
              allocations: {},
              isPending: resource.isPending
            };
            setResources(prev => [...prev, newResource]);
            setShowAddResource(false);
            toast.success(`${resource.name} added to project`);
          }} 
        />
      )}
    </>;
};
