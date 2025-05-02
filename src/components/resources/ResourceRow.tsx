
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { useResourceAllocationsDB } from '@/hooks/allocations';
import { ResourceUtilizationBadge } from './components/ResourceUtilizationBadge';

interface ResourceRowProps {
  resource: {
    id: string;
    name: string;
    role: string;
    allocations?: Record<string, number>;
    isPending?: boolean;
  };
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  projectId: string;
  onAllocationChange: (resourceId: string, weekKey: string, hours: number) => void;
  onDeleteResource: (resourceId: string) => void;
  isEven?: boolean;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  resource,
  weeks,
  projectId,
  onAllocationChange,
  onDeleteResource,
  isEven = false
}) => {
  // Use the DB hook instead of local state
  const resourceType = resource.isPending ? 'pre_registered' : 'active';
  const { 
    allocations, 
    isLoading, 
    isSaving, 
    saveAllocation 
  } = useResourceAllocationsDB(projectId, resource.id, resourceType);

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white hover:bg-gray-50" 
    : "bg-gray-50 hover:bg-gray-100";

  const handleAllocationChange = (weekKey: string, value: string) => {
    const numValue = parseInt(value, 10);
    const hours = isNaN(numValue) ? 0 : numValue;
    
    console.log(`Saving allocation for resource ${resource.id}, week ${weekKey}: ${hours} hours`);
    
    // Save to database with the specific date
    saveAllocation(weekKey, hours);
    
    // Propagate change to parent for UI updates
    onAllocationChange(resource.id, weekKey, hours);
  };
  
  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };

  // Calculate total allocated hours across all weeks
  const totalAllocatedHours = Object.values(allocations).reduce((sum, hours) => sum + hours, 0);
  // Standard capacity would be 40 hours per week
  const standardCapacity = 40 * weeks.length;
  // Calculate utilization percentage
  const utilizationPercentage = standardCapacity > 0 
    ? (totalAllocatedHours / standardCapacity) * 100 
    : 0;
  
  return (
    <tr className={`border-b ${rowBgClass} group`}>
      {/* Fixed counter column */}
      <td className={`sticky left-0 z-10 p-2 w-12 ${rowBgClass}`}></td>
      
      {/* Resource info column */}
      <td className={`sticky left-12 z-10 p-1 ${rowBgClass}`} style={{ width: '60px', minWidth: '60px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="ml-5">
              <div className="font-medium text-xs truncate flex items-center gap-1">
                {resource.name}
                <ResourceUtilizationBadge utilization={utilizationPercentage} size="sm" />
              </div>
              <div className="text-xs text-muted-foreground truncate">{resource.role}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-destructive"
            onClick={() => {
              onDeleteResource(resource.id);
              toast.info(`${resource.name} removed from project`);
            }}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete resource</span>
          </Button>
        </div>
      </td>
      
      {/* Allocation input cells */}
      {weeks.map((week, index) => {
        const weekKey = getWeekKey(week.startDate);
        const hoursValue = allocations[weekKey] || 0;
        
        return (
          <td key={weekKey} className="p-0 text-center" style={{ width: '10px', minWidth: '10px' }}>
            <div className="allocation-input-container px-0.5">
              <Input
                type="number"
                min="0"
                max="168"
                value={hoursValue > 0 ? hoursValue : ''}
                onChange={(e) => handleAllocationChange(weekKey, e.target.value)}
                className={`w-full h-6 px-0 text-center text-xs border-gray-200 focus:border-brand-violet ${isSaving ? 'bg-gray-50' : ''}`}
                placeholder="0"
                disabled={isLoading || isSaving}
              />
            </div>
          </td>
        );
      })}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
}
