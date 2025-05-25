
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { useResourceAllocationsDB } from '@/hooks/allocations';
import { ResourceUtilizationBadge } from './components/ResourceUtilizationBadge';
import { ResourceDeleteDialog } from './dialogs/ResourceDeleteDialog';
import { format } from 'date-fns';

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

interface ResourceRowProps {
  resource: {
    id: string;
    name: string;
    role: string;
    allocations?: Record<string, number>;
    isPending?: boolean;
  };
  days: DayInfo[];
  projectId: string;
  onAllocationChange: (resourceId: string, dayKey: string, hours: number) => void;
  onDeleteResource: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
  isEven?: boolean;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  resource,
  days,
  projectId,
  onAllocationChange,
  onDeleteResource,
  onCheckOtherProjects,
  isEven = false
}) => {
  // Use the DB hook
  const resourceType = resource.isPending ? 'pre_registered' : 'active';
  const { 
    allocations, 
    isLoading, 
    isSaving, 
    saveAllocation 
  } = useResourceAllocationsDB(projectId, resource.id, resourceType);

  // Local state for input values and deletion dialog
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState({
    hasOtherAllocations: false,
    projectCount: 0,
    isLoading: false
  });

  // Initialize input values from allocations
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    
    Object.entries(allocations).forEach(([dayKey, hours]) => {
      initialValues[dayKey] = hours > 0 ? hours.toString() : '';
    });
    
    setInputValues(initialValues);
  }, [allocations]);

  // Handle delete button click
  const handleDeleteClick = async () => {
    if (onCheckOtherProjects) {
      setDeleteDialogData(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await onCheckOtherProjects(resource.id, resourceType);
        setDeleteDialogData({
          hasOtherAllocations: result.hasOtherAllocations,
          projectCount: result.projectCount,
          isLoading: false
        });
        setShowDeleteDialog(true);
      } catch (error) {
        console.error('Error checking other projects:', error);
        setDeleteDialogData(prev => ({ ...prev, isLoading: false }));
        // Fallback to simple deletion
        onDeleteResource(resource.id, false);
      }
    } else {
      // Fallback if check function not provided
      onDeleteResource(resource.id, false);
    }
  };

  // Handle deletion confirmation
  const handleDeleteConfirm = (globalDelete: boolean) => {
    onDeleteResource(resource.id, globalDelete);
    setShowDeleteDialog(false);
  };

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white" 
    : "bg-gray-50";

  // Handle input change locally without saving to DB immediately
  const handleInputChange = (dayKey: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [dayKey]: value
    }));
  };
  
  // Save allocation when user is done typing (on blur)
  const handleInputBlur = (dayKey: string, value: string) => {
    const numValue = parseInt(value, 10);
    const hours = isNaN(numValue) ? 0 : numValue;
    
    console.log(`Saving allocation for resource ${resource.id}, day ${dayKey}: ${hours} hours`);
    
    // Save to database with the specific date
    saveAllocation(dayKey, hours);
    
    // Propagate change to parent for UI updates
    onAllocationChange(resource.id, dayKey, hours);
  };
  
  // Helper to get day key for allocation lookup
  const getDayKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Calculate total allocated hours across all days
  const totalAllocatedHours = Object.values(allocations).reduce((sum, hours) => sum + hours, 0);
  // Standard capacity would be 8 hours per workday
  const standardCapacity = days.filter(d => !d.isWeekend).length * 8;
  // Calculate utilization percentage
  const utilizationPercentage = standardCapacity > 0 
    ? (totalAllocatedHours / standardCapacity) * 100 
    : 0;
  
  return (
    <>
      <tr className={`border-b ${rowBgClass} group hover:bg-gray-50 h-7`}>
        {/* Fixed counter column */}
        <td className={`sticky-left-0 ${rowBgClass} z-10 p-0.5 w-12 group-hover:bg-gray-50`}></td>
        
        {/* Resource info column */}
        <td 
          className={`sticky-left-12 ${rowBgClass} z-10 p-0.5 group-hover:bg-gray-50`} 
          style={{ width: '200px', minWidth: '200px' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="ml-5">
                <div className="font-medium text-xs truncate flex items-center gap-1">
                  {resource.name}
                  <ResourceUtilizationBadge utilization={utilizationPercentage} size="xs" />
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={handleDeleteClick}
              disabled={deleteDialogData.isLoading}
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete resource</span>
            </Button>
          </div>
        </td>
        
        {/* Allocation input cells - one for each day */}
        {days.map((day) => {
          const dayKey = getDayKey(day.date);
          const inputValue = inputValues[dayKey] || '';
          const isWeekendClass = day.isWeekend ? 'weekend' : '';
          const isSundayClass = day.isSunday ? 'sunday-border' : '';
          const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
          const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';
          
          return (
            <td 
              key={dayKey} 
              className={`p-0 text-center ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass}`} 
              style={{ width: '30px', minWidth: '30px' }}
            >
              <div className="allocation-input-container px-0.5">
                <Input
                  type="number"
                  min="0"
                  max="24"
                  value={inputValue}
                  onChange={(e) => handleInputChange(dayKey, e.target.value)}
                  onBlur={(e) => handleInputBlur(dayKey, e.target.value)}
                  className={`w-full h-5 px-0 text-center text-xs border-gray-200 rounded-md focus:border-brand-violet ${isSaving ? 'bg-gray-50' : ''} ${day.isWeekend ? 'bg-muted/20' : ''}`}
                  placeholder=""
                  disabled={isLoading || isSaving}
                />
              </div>
            </td>
          );
        })}
        
        {/* Add blank flexible cell */}
        <td className="p-0"></td>
      </tr>

      {/* Resource Delete Dialog */}
      <ResourceDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={resource.name}
        hasOtherAllocations={deleteDialogData.hasOtherAllocations}
        projectCount={deleteDialogData.projectCount}
        isLoading={deleteDialogData.isLoading}
      />
    </>
  );
};
