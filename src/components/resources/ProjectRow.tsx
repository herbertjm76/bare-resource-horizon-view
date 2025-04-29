import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, UserPlus, Circle, Square, Diamond } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/AddResourceDialog';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStageColorMap } from '@/components/projects/hooks/useProjectColors';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

type MilestoneType = 'none' | 'milestone' | 'kickoff' | 'workshop' | 'deadline';
type MilestoneInfo = {
  type: MilestoneType;
  stage?: string; // Optional stage name
  icon?: 'circle' | 'square' | 'diamond';
};

// Define a type for continuity to ensure we handle both cases properly
type Continuity = { left: boolean; right: boolean } | false;

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

  // Track all allocations by resource and week
  const [projectAllocations, setProjectAllocations] = useState<Record<string, Record<string, number>>>({});

  // Track milestones and stages for each week
  const [weekMilestones, setWeekMilestones] = useState<Record<string, MilestoneInfo>>({});
  
  // Get stage colors from the project if available
  const stageColorMap = useStageColorMap(project?.officeStages || []);

  // Sum up all resource hours for each week
  const weeklyProjectHours = React.useMemo(() => {
    const weekHours: Record<string, number> = {};

    // Initialize all weeks with 0 hours
    weeks.forEach(week => {
      const weekKey = week.startDate.toISOString().split('T')[0];
      weekHours[weekKey] = 0;
    });

    // Sum up hours across all resources
    Object.values(projectAllocations).forEach(resourceAlloc => {
      Object.entries(resourceAlloc).forEach(([weekKey, hours]) => {
        if (weekHours[weekKey] !== undefined) {
          weekHours[weekKey] += hours;
        }
      });
    });
    return weekHours;
  }, [projectAllocations, weeks]);

  // Handle resource allocation changes
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => ({
      ...prev,
      [resourceId]: {
        ...(prev[resourceId] || {}),
        [weekKey]: hours
      }
    }));
  };

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

  // Set milestone or stage for a specific week
  const setWeekMilestone = (weekKey: string, milestoneInfo: MilestoneInfo) => {
    setWeekMilestones(prev => ({
      ...prev,
      [weekKey]: milestoneInfo
    }));
    
    // Show toast message
    if (milestoneInfo.type === 'none') {
      toast.info("Milestone removed");
    } else if (milestoneInfo.stage) {
      toast.success(`Stage ${milestoneInfo.stage} set for week of ${weekKey}`);
    } else {
      toast.success(`${milestoneInfo.type} set for week of ${weekKey}`);
    }
  };

  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };

  // Get milestone icon component
  const getMilestoneIcon = (type: MilestoneType) => {
    switch (type) {
      case 'milestone':
        return <Circle className="h-3 w-3" fill="black" />;
      case 'kickoff':
        return <Square className="h-3 w-3" fill="black" />;
      case 'workshop':
        return <Circle className="h-3 w-3" fill="black" />;
      case 'deadline':
        return <Diamond className="h-3 w-3" fill="black" />;
      default:
        return null;
    }
  };

  // Get milestone color based on stage
  const getMilestoneColor = (milestone: MilestoneInfo) => {
    if (milestone.stage && stageColorMap[milestone.stage]) {
      return stageColorMap[milestone.stage];
    }
    return undefined;
  };

  // Get icon alignment based on milestone type
  const getMilestoneAlignment = (type: MilestoneType): string => {
    switch (type) {
      case 'kickoff':
        return 'justify-start';
      case 'workshop':
        return 'justify-center';
      case 'deadline':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  // Check if there's a milestone in the adjacent week
  const hasContinuousStage = (weekIndex: number, currentMilestone: MilestoneInfo | undefined): Continuity => {
    if (!currentMilestone || !currentMilestone.stage) return false;
    
    const prevWeekKey = weekIndex > 0 ? getWeekKey(weeks[weekIndex - 1].startDate) : null;
    const nextWeekKey = weekIndex < weeks.length - 1 ? getWeekKey(weeks[weekIndex + 1].startDate) : null;
    
    const prevMilestone = prevWeekKey ? weekMilestones[prevWeekKey] : undefined;
    const nextMilestone = nextWeekKey ? weekMilestones[nextWeekKey] : undefined;
    
    const leftContinuous = prevMilestone?.stage === currentMilestone.stage && !prevMilestone.type;
    const rightContinuous = nextMilestone?.stage === currentMilestone.stage && !nextMilestone.type;
    
    return { left: leftContinuous, right: rightContinuous };
  };

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white hover:bg-gray-50" 
    : "bg-gray-50 hover:bg-gray-100";
  
  // Header row background
  const headerBgClass = isEven 
    ? "bg-brand-violet-light/70 hover:bg-brand-violet-light" 
    : "bg-brand-violet-light hover:bg-brand-violet-light/90";

  return <>
      <tr className={`border-t border-b border-gray-200 ${headerBgClass}`}>
        {/* Resource count column */}
        <td className={`sticky left-0 z-10 p-2 w-12 text-center ${headerBgClass}`}>
          {/* Counter moved to the project name cell */}
        </td>

        {/* Project name cell with the counter on the right */}
        <td className={`sticky left-12 z-10 p-2 cursor-pointer ${headerBgClass}`} onClick={onToggleExpand}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <div>
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-muted-foreground">{project.code}</div>
              </div>
            </div>
            
            {/* Always show resource counter */}
            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand-violet text-white text-xs font-medium">
              {resources.length}
            </div>
          </div>
        </td>
        
        {/* Week allocation cells - always show project totals */}
        {weeks.map((week, weekIndex) => {
        const weekKey = getWeekKey(week.startDate);
        const projectHours = weeklyProjectHours[weekKey] || 0;
        const milestone = weekMilestones[weekKey];
        const milestoneColor = milestone ? getMilestoneColor(milestone) : undefined;
        const continuity = milestone?.stage ? hasContinuousStage(weekIndex, milestone) : false;
        const alignment = milestone?.type ? getMilestoneAlignment(milestone.type) : 'justify-center';
        
        return <td key={weekKey} className="p-0 border-b text-center font-medium w-8 relative">
              <div className="flex flex-col items-center">
                {/* Milestone/Stage indicator area - clickable */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full h-5 cursor-pointer flex justify-center items-center">
                      {milestone && milestone.type !== 'none' ? (
                        <div className={`relative flex items-center ${alignment} h-3 w-full`}>
                          <div 
                            className={`absolute h-[1.33px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
                            style={{
                              backgroundColor: milestoneColor || '#E5DEFF',
                              width: 'calc(100% - 2px)',
                              left: continuity && continuity.left ? '-1px' : '1px',
                              right: continuity && continuity.right ? '-1px' : '1px'
                            }}
                          />
                          <div className="relative z-10">
                            {getMilestoneIcon(milestone.type)}
                          </div>
                        </div>
                      ) : milestone?.stage ? (
                        <div 
                          className={`h-[1.33px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
                          style={{
                            backgroundColor: milestoneColor || '#E5DEFF',
                            width: '100%',
                            marginLeft: continuity && continuity.left ? '-1px' : '0',
                            marginRight: continuity && continuity.right ? '-1px' : '0'
                          }}
                        />
                      ) : (
                        <div className="h-[1.33px] w-4/5 border border-dotted border-gray-300 opacity-30 rounded" />
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3" align="center">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Week of {week.label}</h4>
                      
                      {/* Project stage selector */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium">Set Stage</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {project.officeStages?.map((stage: any) => (
                            <TooltipProvider key={stage.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                                    onClick={() => setWeekMilestone(weekKey, { 
                                      type: 'none',
                                      stage: stage.name
                                    })}
                                  >
                                    <div 
                                      className="h-3 w-3 rounded-sm flex-shrink-0"
                                      style={{ backgroundColor: stage.color || '#E5DEFF' }}
                                    />
                                    <span className="text-xs truncate">{stage.name}</span>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{stage.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                                  onClick={() => setWeekMilestone(weekKey, { type: 'none' })}
                                >
                                  <div className="h-3 w-3 rounded-sm border border-gray-300 flex-shrink-0" />
                                  <span className="text-xs">Clear</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove stage</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      {/* Milestone type selector */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium">Set Milestone</h5>
                        <div className="flex flex-wrap gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 px-2 py-1"
                                  onClick={() => setWeekMilestone(weekKey, { 
                                    type: 'kickoff',
                                    stage: milestone?.stage,
                                    icon: 'square'
                                  })}
                                >
                                  <Square className="h-3 w-3 mr-1" fill="black" /> Kickoff
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Project kickoff</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 py-1"
                                  onClick={() => setWeekMilestone(weekKey, { 
                                    type: 'workshop',
                                    stage: milestone?.stage,
                                    icon: 'circle'
                                  })}
                                >
                                  <Circle className="h-3 w-3 mr-1" fill="black" /> Workshop
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Project workshop</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 py-1"
                                  onClick={() => setWeekMilestone(weekKey, { 
                                    type: 'deadline',
                                    stage: milestone?.stage,
                                    icon: 'diamond'
                                  })}
                                >
                                  <Diamond className="h-3 w-3 mr-1" fill="black" /> Deadline
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Project deadline</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-7 px-2 py-1"
                                  onClick={() => setWeekMilestone(weekKey, { type: 'none' })}
                                >
                                  Clear
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove milestone</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Hours display */}
                <div className="py-[6px] px-0">
                  <span className="text-[15px] font-bold">{projectHours}h</span>
                </div>
              </div>
            </td>;
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
      
      {/* Add resource row when project is expanded */}
      {isExpanded && (
        <tr className={`border-b ${rowBgClass}`}>
          <td className={`sticky left-0 z-10 w-12 ${rowBgClass}`}></td>
          <td className={`sticky left-12 z-10 p-2 ${rowBgClass}`}>
            <Button variant="ghost" size="sm" className="ml-8 text-muted-foreground" onClick={() => setShowAddResource(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </td>
          
          {weeks.map((_, i) => <td key={i} className="p-0 w-8"></td>)}
        </tr>
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
