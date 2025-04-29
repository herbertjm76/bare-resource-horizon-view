import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResourceRow } from '@/components/resources/ResourceRow';
import { AddResourceDialog } from '@/components/resources/AddResourceDialog';
import { toast } from 'sonner';
interface ProjectRowProps {
  project: any;
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}
export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  weeks,
  isExpanded,
  onToggleExpand
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
  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };
  return <>
      <tr className="bg-brand-violet-light hover:bg-brand-violet-light/80">
        {/* Resource count column */}
        <td className="sticky left-0 bg-brand-violet-light hover:bg-brand-violet-light/80 z-10 p-2 border-b w-12 text-center">
          {/* Counter moved to the project name cell */}
        </td>

        {/* Project name cell with the counter on the right */}
        <td className="sticky left-12 bg-brand-violet-light hover:bg-brand-violet-light/80 z-10 p-2 border-b cursor-pointer" onClick={onToggleExpand}>
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
        {weeks.map(week => {
        const weekKey = getWeekKey(week.startDate);
        const projectHours = weeklyProjectHours[weekKey] || 0;
        return <td key={weekKey} className="p-0 border-b text-center font-medium w-8">
              <div className="py-[8px] px-0">
                <span className="text-[15px] font-bold">{projectHours}h</span>
              </div>
            </td>;
      })}
      </tr>
      
      {/* Resource rows when project is expanded */}
      {isExpanded && resources.map(resource => <ResourceRow key={resource.id} resource={resource} weeks={weeks} projectId={project.id} onAllocationChange={handleAllocationChange} onDeleteResource={handleDeleteResource} />)}
      
      {/* Add resource row when project is expanded */}
      {isExpanded && <tr className="bg-muted/5 hover:bg-muted/10">
          <td className="sticky left-0 bg-muted/5 hover:bg-muted/10 z-10 border-b w-12"></td>
          <td className="sticky left-12 bg-muted/5 hover:bg-muted/10 z-10 p-2 border-b">
            <Button variant="ghost" size="sm" className="ml-8 text-muted-foreground" onClick={() => setShowAddResource(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </td>
          
          {weeks.map((_, i) => <td key={i} className="p-0 border-b w-8"></td>)}
        </tr>}
      
      {showAddResource && <AddResourceDialog projectId={project.id} onClose={() => setShowAddResource(false)} onAdd={resource => {
      const newResource = {
        id: resource.staffId,
        name: resource.name,
        role: resource.role || 'Team Member',
        // Include role if available
        allocations: {},
        isPending: resource.isPending
      };
      setResources(prev => [...prev, newResource]);
      setShowAddResource(false);
      toast.success(`${resource.name} added to project`);
    }} />}
    </>;
};
