
import React from 'react';
import { format } from 'date-fns';
import { useAllocationInput } from './hooks/useAllocationInput';
import { ResourceInfo } from './components/ResourceInfo';
import { AllocationInputCell } from './components/AllocationInputCell';

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
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
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
  const resourceType = resource.isPending ? 'pre_registered' : 'active';
  
  const {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  } = useAllocationInput({
    projectId,
    resourceId: resource.id,
    resourceType,
    onAllocationChange
  });

  // Helper to get day key for allocation lookup
  const getDayKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Calculate total allocated hours ONLY for the visible days in the grid
  const totalAllocatedHours = days.reduce((sum, day) => {
    const dayKey = getDayKey(day.date);
    const hours = allocations[dayKey] || 0;
    return sum + hours;
  }, 0);

  // Calculate standard capacity ONLY for the visible workdays in the grid
  const standardCapacity = days.filter(d => !d.isWeekend).length * 8;
  
  // Calculate utilization percentage based ONLY on visible days
  const utilizationPercentage = standardCapacity > 0 
    ? (totalAllocatedHours / standardCapacity) * 100 
    : 0;

  console.log(`ResourceRow - ${resource.first_name} ${resource.last_name}:`, {
    totalAllocatedHours,
    standardCapacity,
    utilizationPercentage,
    visibleDays: days.length,
    workDays: days.filter(d => !d.isWeekend).length
  });

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white" 
    : "bg-gray-50";

  return (
    <tr className={`border-b ${rowBgClass} group hover:bg-gray-50 h-7`}>
      {/* Fixed counter column */}
      <td className={`sticky-left-0 ${rowBgClass} z-10 p-0.5 w-12 group-hover:bg-gray-50`}></td>
      
      {/* Resource info column */}
      <ResourceInfo
        resource={resource}
        utilizationPercentage={utilizationPercentage}
        rowBgClass={rowBgClass}
        onDeleteResource={onDeleteResource}
        onCheckOtherProjects={onCheckOtherProjects}
      />
      
      {/* Allocation input cells - one for each day */}
      {days.map((day) => {
        const dayKey = getDayKey(day.date);
        const inputValue = inputValues[dayKey] || '';
        
        return (
          <AllocationInputCell
            key={dayKey}
            day={day}
            dayKey={dayKey}
            inputValue={inputValue}
            isLoading={isLoading}
            isSaving={isSaving}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
          />
        );
      })}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
};
